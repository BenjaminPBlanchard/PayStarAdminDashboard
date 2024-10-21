using System;
using System.Linq;
using System.Threading.Tasks;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Data.Entities;

namespace PayStarAdminDashboard.Services.EmailRequest
{

    public interface IEmailRequest
    {
        Task SendEmail();
    }
    
    public class EmailRequest : IEmailRequest
    {
        private readonly DataContext dataContext;
        private readonly IEmailService emailService;

        public EmailRequest(DataContext dataContext, IEmailService emailService)
        {
            this.dataContext = dataContext;
            this.emailService = emailService;
        }

        public async Task SendEmail()
        {
            string emailBody = "";

            var jobs = dataContext.Set<Jobs>().ToList();

            foreach(Jobs job in jobs)
            {
                if(job.LastExecutionStatus != "Successful")
                {
                    emailBody += $"{job.Description} failed at {job.LastExecutionDate.ToLocalTime()}.\n";
                }
                
                var expectation = dataContext.Set<JobExpectation>().Where(x => x.JobId == job.Id).FirstOrDefault();
                if (expectation != null)
                {
                    if(job.LastSuccess < (DateTimeOffset.Now.AddDays(-expectation.Days).AddHours(-expectation.Hours)))
                    {
                        emailBody += $"{job.Description} did not meet the expectation of Days: {expectation.Days} Hours: {expectation.Hours} .\n";
                    }    
                }
            }

            if (emailBody != "")
            {
                await emailService.SendEmailAsync("<ENTER EMAIL HERE>", "Job Error Report", emailBody);    
            }
        }
    }
}