using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PayStarAdminDashboard.Data.Entities;
using PayStarAdminDashboard.Data.Entities.SalesAgency;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Clients;
using PayStarAdminDashboard.Features.Contacts;
using PayStarAdminDashboard.Features.SalesRepresentatives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<Client> Clients { get;set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<SalesAgency> SalesAgency { get; set; }
        public DbSet<Note> Note { get; set; }
        public DbSet<Jobs> Jobs { get; set; }
        public DbSet<JobExpectation> JobExpectations { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var userRoleBuilder = builder.Entity<UserRole>();

            userRoleBuilder.HasKey(x => new {x.UserId, x.RoleId});

            userRoleBuilder.HasOne(x => x.Role)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.RoleId);

            userRoleBuilder.HasOne(x => x.User)
                .WithMany(x => x.Roles)
                .HasForeignKey(x => x.UserId);

            builder.Entity<Note>();
            builder.Entity<Client>();
            builder.Entity<Contact>();
            builder.Entity<SalesAgency>();
            builder.Entity<Jobs>();
        }
    }
}
