using System.Net.Mail;
using System.Threading.Tasks;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using PayStarAdminDashboard.Services.EmailRequest;

namespace PayStarAdminDashboard.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string body);
    }
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly IWebHostEnvironment _env;

        public EmailService(IOptions<SmtpSettings> smtpSettings, IWebHostEnvironment env)
        {
            this._smtpSettings = smtpSettings.Value;
            this._env = env;
        }

        public async Task SendEmailAsync(string email, string subject, string body)
        {
            var fromAddress = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName);
            var toAddress = new MailAddress(email, "To Name");
            string fromPassword = _smtpSettings.Password;

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = _smtpSettings.Port,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                smtp.Send(message);
            }
        }
    }
}