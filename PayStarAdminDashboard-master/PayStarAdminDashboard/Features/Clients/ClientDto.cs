using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Clients
{
    public class ClientDto
    {
        public int Id { get; set; }
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
        public long TransactionCount { get; set; }
        public long NetRevenue { get; set; }
    }
}
