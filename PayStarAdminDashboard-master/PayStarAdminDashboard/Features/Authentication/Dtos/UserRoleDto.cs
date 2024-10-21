using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Authentication.Dtos
{
    public class UserRoleDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public IList<string> UserRoles { get; set; }
    }
}
