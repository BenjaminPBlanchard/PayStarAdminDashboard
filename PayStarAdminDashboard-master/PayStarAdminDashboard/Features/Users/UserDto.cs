using PayStarAdminDashboard.Features.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Users
{
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public ICollection<UserRole> Roles { get; set; }

    }
}
