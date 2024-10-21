using PayStarAdminDashboard.Data.Entities.SalesAgency;
using PayStarAdminDashboard.Features.Clients;
﻿using PayStarAdminDashboard.Features.SalesRepresentatives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Contacts
{
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string MobilePhoneNumber { get; set; }
        public string OfficePhoneNumber { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsDeleted { get; set; }
        public virtual Client Client { get; set; }
        public int ClientId { get; set; }
    }
}
