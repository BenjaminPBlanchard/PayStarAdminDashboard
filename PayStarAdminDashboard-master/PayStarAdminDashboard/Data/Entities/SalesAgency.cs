using PayStarAdminDashboard.Features.Clients;
using PayStarAdminDashboard.Features.Contacts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Data.Entities.SalesAgency
{
    public class SalesAgency
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Client> Clients { get; set; }
        public int ClientId { get; set; }

    }
}
