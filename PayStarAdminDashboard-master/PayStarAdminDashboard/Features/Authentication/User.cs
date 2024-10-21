using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Authentication
{
    public class User: IdentityUser<int>
    {
        public virtual ICollection<UserRole> Roles { get; set; } = new List<UserRole>();
        public string HubspotAPIKey { get; set; }
    }
}
