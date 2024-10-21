using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Contacts
{
    public class ContactEditDto
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string MobilePhoneNumber { get; set; }
        public string OfficePhoneNumber { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsDeleted { get; set; }
        public int ClientId { get; set; }
    }
}
