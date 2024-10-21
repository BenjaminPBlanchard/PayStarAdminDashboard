using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Clients
{
    public class ClientCreateDto
    {
        public string IvrPhoneNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string Name { get; set; }
        public string BillingSystem { get; set; }
        public string VersionOneId { get; set; }
        public string VersionTwoId { get; set; }
        public bool IsMigrating { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Zip { get; set; }
        

    }
}
