using PayStarAdminDashboard.Data.Entities;
using PayStarAdminDashboard.Data.Entities.SalesAgency;
using PayStarAdminDashboard.Features.Contacts;
using PayStarAdminDashboard.Features.SalesRepresentatives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Clients
{
    public class Client
    {
        public int Id { get; set; }
        public string IvrPhoneNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string Name { get; set; }
        public string BillingSystem { get; set; }
        public string? VersionOneId { get; set; }
        public string? VersionTwoId { get; set; }
        public bool IsMigrating { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string Zip { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public long TransactionCount { get; set; }
        public long NetRevenue { get; set; }
        public virtual ICollection<Contact> Contacts { get; set; }
        public int ContactId { get; set; }
        public virtual ICollection<Note> Notes { get; set; }
        public int NoteId { get; set; }
        public virtual SalesAgency SalesAgency { get; set; }
        public int SalesAgencysId { get; set; }

    }
}
