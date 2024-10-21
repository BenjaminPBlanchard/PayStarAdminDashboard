using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.OpenApi.Models;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Data.Entities;
using PayStarAdminDashboard.Data.Entities.SalesAgency;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Clients;
using PayStarAdminDashboard.Features.Contacts;
using PayStarAdminDashboard.Features.Notes;
using PayStarAdminDashboard.Services;
using PayStarAdminDashboard.Services.ApiRequest;
using PayStarAdminDashboard.Services.EmailRequest;

namespace PayStarAdminDashboard
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DataContext")));

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<DataContext>();

            services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = 403;
                    return Task.CompletedTask;
                };
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });   

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "PayStarAdminDashboard API", Version = "v1" });
            });
            
            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(Configuration.GetConnectionString("DataContext"), new SqlServerStorageOptions
                {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    QueuePollInterval = TimeSpan.Zero,
                    UseRecommendedIsolationLevel = true,
                    DisableGlobalLocks = true
                }));
            
            services.AddHangfireServer();
            services.AddScoped<IJobSummaryRequest, JobSummaryRequest>();
            services.AddScoped<ITransactionSummaries, TransactionSummaryRequest>();
            services.AddScoped<IClientsRequest, ClientsRequest>();
            services.Configure<SmtpSettings>(Configuration.GetSection("SmtpSettings"));
            services.AddSingleton<IEmailService, EmailService>();
            services.AddScoped<IEmailRequest, EmailRequest>();

        }   

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IBackgroundJobClient backgroundJobs, IWebHostEnvironment env, 
                                IJobSummaryRequest jobSummaryRequest, ITransactionSummaries transactionSummaries, 
                                IClientsRequest clientsRequest, IEmailRequest emailRequest)
        {
            MigrateDb(app);
            SeedSalesAgency(app);
            SeedClients(app);
            SeedContacts(app);
            
            AddRoles(app).GetAwaiter().GetResult();
            AddUsers(app).GetAwaiter().GetResult();
            SeedNotes(app);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "PayStar Admin Dashboard API V1");
            });

            app.UseHangfireDashboard();

            RecurringJob.AddOrUpdate(() => clientsRequest.MakeRequest(), Cron.Hourly);
            RecurringJob.AddOrUpdate(() => transactionSummaries.MakeRequest(), Cron.Hourly);
            RecurringJob.AddOrUpdate(() => jobSummaryRequest.MakeRequest(), Cron.Hourly);
            RecurringJob.AddOrUpdate(() => emailRequest.SendEmail(), Cron.Daily);
            
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseHttpsRedirection();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private static async Task AddRoles(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var roleManager = serviceScope.ServiceProvider.GetService<RoleManager<Role>>();
                if (roleManager.Roles.Any())
                {
                    return;
                }

                await roleManager.CreateAsync(new Role {Name = Roles.Admin});
                await roleManager.CreateAsync(new Role {Name = Roles.Employee});
            }
        }

        private static async Task AddUsers(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var userManager = serviceScope.ServiceProvider.GetService<UserManager<User>>();
                if (userManager.Users.Any())
                {
                    return;
                }
                await CreateUser(userManager, "admin", Roles.Admin, "<HUBSPOT API KEY>");
                await CreateUser(userManager, "employee", Roles.Employee, "<HUBSPOT API KEY>");
            }
        }

        private static async Task CreateUser(UserManager<User> userManager, string username, string role, string hubSpotAPIKey)
        {
            const string passwordForEveryone = "Password123!";
            var user = new User {UserName = username, HubspotAPIKey = hubSpotAPIKey };
            await userManager.CreateAsync(user, passwordForEveryone);
            await userManager.AddToRoleAsync(user, role);
        }

        private static void MigrateDb(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<DataContext>();
                context.Database.Migrate();
            }
        }

        private static void SeedClients(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<DataContext>();
                if (context.Set<Client>().Any())
                {
                    return;
                }

                context.Set<Client>().Add(new Client {IvrPhoneNumber = "9852738590" , PhoneNumber = "9851188958", Name = "Saint Charles Water", BillingSystem = "Stripe", IsMigrating = true, StreetAddress = "50074 W Church St.", City = "Hammond",State = "Louisiana", Country = "United States" , Zip = "70443", VersionOneId="601", TransactionCount = 10,NetRevenue = 5000});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "2258469578" , PhoneNumber = "9851857496", Name = "Tallow Creek Home Onwers Association", BillingSystem = "Fusebill", IsMigrating = true, StreetAddress = "10233 Highway 50", City = "Amite",State = "Louisiana" , Country = "United States", Zip = "70403", VersionOneId="601",VersionTwoId="stcharles", TransactionCount = 30, NetRevenue = 100});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "5043258468" , PhoneNumber = "9851857496", Name = "Charlie's Hardware", BillingSystem = "Stripe", IsMigrating = true, StreetAddress = "85771 Medus St.", City = "Loranger",State = "Louisiana" , Country = "United States", Zip = "71302", VersionOneId="601", TransactionCount = 2, NetRevenue = 300});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "9857895841" , PhoneNumber = "9850023548", Name = "Waste Management", BillingSystem = "PayPal", IsMigrating = true, StreetAddress = "78856 Lowe Davis St.", City = "Covington",State = "Louisiana" , Country = "United States", Zip = "70435", VersionOneId="601",VersionTwoId="stcharles", TransactionCount = 20, NetRevenue = 30000});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "9854682149" , PhoneNumber = "9854048591", Name = "Turner Industries", BillingSystem = "Freshbooks", IsMigrating = true, StreetAddress = "15547 HWY 437", City = "Slidell",State = "Louisiana", Country = "United States", Zip = "71057", VersionOneId="601", TransactionCount = 10, NetRevenue = 9675100});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "5048527322" , PhoneNumber = "9852133585", Name = "Water Works", BillingSystem = "Quickbooks", IsMigrating = true, StreetAddress = "82246 HWY 190", City = "Robert",State = "Louisiana", Country = "United States", Zip = "78077",VersionOneId="601", VersionTwoId="stcharles", TransactionCount = 24, NetRevenue = 5285});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "5042385746" , PhoneNumber = "4032558965", Name = "Royal Mini-Storage", BillingSystem = "PayPal", IsMigrating = true, StreetAddress = "63395 Fairfields Ave.", City = "Baton Rouge",State = "Louisiana", Country = "United States", Zip = "60855", VersionOneId="601", TransactionCount = 31, NetRevenue = 8510});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "2252948574" , PhoneNumber = "4059958435", Name = "Saint Tammany Parish Parking Tickets", BillingSystem = "Freshbooks", IsMigrating = true, StreetAddress = "22857 HWY 49", City = "Kenner",State = "Louisiana", Country = "United States", Zip = "70400",VersionOneId="601", VersionTwoId="stcharles", TransactionCount = 32, NetRevenue = 54854});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "2125483526" , PhoneNumber = "3185577486", Name = "Ponchatula Zoning", BillingSystem = "Stripe", IsMigrating = true, StreetAddress = "75584 HWY 135", City = "Shreveport", State = "Louisiana", Country = "United States", Zip = "70420", VersionOneId="601", TransactionCount = 30, NetRevenue = 88632});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "5048572104" , PhoneNumber = "5043211587", Name = "Southeastern Louisiana University Controllers Office", BillingSystem = "Stripe", IsMigrating = true, StreetAddress = "13264 Williams Rd.", City = "Lafayette",State = "Louisiana", Country = "United States", Zip = "70584",VersionOneId="601", VersionTwoId="stcharles", TransactionCount = 51, NetRevenue = 522485745});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "9853215847" , PhoneNumber = "2255488753", Name = "Louisiana State University Fees Office", BillingSystem = "Square", IsMigrating = true, StreetAddress = "43351 Thomas Ave.", City = "New Orleans",State = "Louisiana", Country = "United States", Zip = "70400", VersionOneId="601", TransactionCount = 13, NetRevenue = 21057});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "5043238885" , PhoneNumber = "2255847541", Name = "Baton Rouge Zoning Office", BillingSystem = "PayPal", IsMigrating = true, StreetAddress = "11345 Willams Way", City = "Ponchatoula",State = "Louisiana", Country = "United States", Zip = "78433",VersionOneId="601", VersionTwoId="stcharles", TransactionCount = 85, NetRevenue = 31051});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "9854492817" , PhoneNumber = "9851158545", Name = "Maestri's Consulting", BillingSystem = "QuickBooks", IsMigrating = true, StreetAddress = "82241 Juris Ln.", City = "Independence",State = "Louisiana", Country = "United States", Zip = "78465", VersionOneId="601", TransactionCount = 1, NetRevenue = 126});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "9850251236" , PhoneNumber = "9856958458", Name = "S&W Contracting", BillingSystem = "Square", IsMigrating = true, StreetAddress = "14485 Jenkins Rd.", City = "Tickfaw",State = "Louisiana", Country = "United States", Zip = "79488",VersionOneId="601", VersionTwoId="stcharles", TransactionCount = 31, NetRevenue = 22824});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "5045583328" , PhoneNumber = "9855528475", Name = "Williams Law", BillingSystem = "Quickbooks", IsMigrating = true, StreetAddress = "68857 Walker Rd.", City = "Natalbany",State = "Louisiana", Country = "United States", Zip = "70458", VersionOneId="601", TransactionCount = 67, NetRevenue = 22518});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "9857365422" , PhoneNumber = "9853166216", Name = "Jacksonville Private Security", BillingSystem = "Fusebill", IsMigrating = true, StreetAddress = "13358 HWY 75", City = "Albany",State = "Louisiana", Country = "United States", Zip = "74053",VersionOneId="601", VersionTwoId="stcharles", TransactionCount = 15, NetRevenue = 22444});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "9857738594" , PhoneNumber = "2254877541", Name = "Saint Thomas Urgent Care", BillingSystem = "Freshbooks", IsMigrating = true, StreetAddress = "77452 James Rd.", City = "Springfield",State = "Louisiana", Country = "United States", Zip = "70857", VersionOneId="601", TransactionCount = 54, NetRevenue = 117457});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "5048254771" , PhoneNumber = "5043695821", Name = "Rawson Medical", BillingSystem = "PayPal", IsMigrating = true, StreetAddress = "36657 St. James Avenue", City = "Livingston",State = "Louisiana", Country = "United States", Zip = "70438",VersionOneId="601", VersionTwoId="stcharles", TransactionCount = 5, NetRevenue = 11456});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "2258595784" , PhoneNumber = "2256355412", Name = "Johnson & Johnson", BillingSystem = "FuseBill",  IsMigrating = true, StreetAddress = "48857 HWY 47", City = "Satsuma",State = "Louisiana", Country = "United States", Zip = "70847", VersionOneId="601", TransactionCount = 14, NetRevenue = 2774875});
                context.Set<Client>().Add(new Client {IvrPhoneNumber = "2258577841" , PhoneNumber = "9853364587", Name = "Hamlin Hamlin & McGill", BillingSystem = "Stripe", IsMigrating = true, StreetAddress = "St. Joseph Street", City = "Hammond",State = "Louisiana", Country = "United States", Zip = "70443",VersionOneId="601", VersionTwoId="stcharles", TransactionCount = 4, NetRevenue = 22748});
                context.SaveChanges();
            }
        }

        private static void SeedSalesAgency(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<DataContext>();
                if (context.Set<SalesAgency>().Any())
                {
                    return;
                }
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Prefered Sales Agency Ltd", ClientId = 1 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Synergy Sales Recruiting-La", ClientId = 2 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Banner Sales", ClientId = 3 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Wink Media", ClientId = 4 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Express Professionals", ClientId = 5 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "GoDo", ClientId = 6 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Kennedy Lewis Renton & Associates", ClientId = 7 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Johnson and Williams Sales INC", ClientId = 8 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Wilson Holdings LLC", ClientId = 9 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Trueman Media", ClientId = 10 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "P&C Sales Representatives", ClientId = 11 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "SAS Sales Services", ClientId = 12 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Elemerce", ClientId = 13 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Stone Forrest Media", ClientId = 14 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Exxel Sales", ClientId = 15 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Beeal Sales Group", ClientId = 16 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "ARC Sales Solutions", ClientId = 17 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Calculated Sales Management LLC", ClientId = 18 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "American Marketing, Publishing and Sales", ClientId = 19 });
                context.Set<SalesAgency>().Add(new SalesAgency { Name = "Karigan Incorperated", ClientId = 20 });
                context.SaveChanges();
            }
        }

        private static void SeedContacts(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<DataContext>();
                if (context.Set<Contact>().Any())
                {
                    return;
                }
                context.Set<Contact>().Add(new Contact { Name = "Travis Jenkins", Title = "Accounts Recievable", MobilePhoneNumber = "5043358475", OfficePhoneNumber = "5043328574", IsPrimary = true, IsDeleted = false, ClientId = 1 });
                context.Set<Contact>().Add(new Contact { Name = "Scott Michael", Title = "Billing", MobilePhoneNumber = "9850128574", OfficePhoneNumber = "5042258474", IsPrimary = true, IsDeleted = false, ClientId = 2 });
                context.Set<Contact>().Add(new Contact { Name = "Trent Little", Title = "CEO", MobilePhoneNumber = "9850012521", OfficePhoneNumber = "9854755841", IsPrimary = true, IsDeleted = false, ClientId = 3 });
                context.Set<Contact>().Add(new Contact { Name = "Sam Jackson", Title = "Billing Manger", MobilePhoneNumber = "2259488758", OfficePhoneNumber = "5043328574", IsPrimary = true, IsDeleted = false, ClientId = 1 });
                context.Set<Contact>().Add(new Contact { Name = "Vincent Dupree", Title = "Accounts Recievable", MobilePhoneNumber = "9853125584", OfficePhoneNumber = "9852215887", IsPrimary = true, IsDeleted = false, ClientId = 2 });
                context.SaveChanges();
            }
        }

        private static void SeedNotes(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<DataContext>();
                if (context.Set<Note>().Any())
                {
                    return;
                }
                context.Set<Note>().Add(new Note{ ClientId = 1, Content = "Need to follow up on lack of report uploads.", UserId = 1, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 1, Content = "Contact for migrating to version 2.", UserId = 1, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 1, Content = "Solved report issue, servers were down.", UserId = 2, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 1, Content = "Client decided to remain on version 1.", UserId = 1, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 2, Content = "Need to backup user data for redundancy.", UserId = 2, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 3, Content = "User data was already backed up last week.", UserId = 1, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 3, Content = "Oh, ok. Will take it off of the task board then.", UserId = 2, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 3, Content = "Just reviewed contact information we have. Need to reach out to the company and confirm contacts and their numbers, many employees have retired.", UserId = 1, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 3, Content = "I will get Julie on that.", UserId = 2, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 3, Content = "Julie just reached out. All of the contacts are the same.", UserId = 1, CreatedDate = DateTimeOffset.Now });
                context.Set<Note>().Add(new Note{ ClientId = 4, Content = "Client finished migration to Version 2 last month.", UserId = 1, CreatedDate = DateTimeOffset.Now });
                context.SaveChanges();
            }
        }
    }
}
