using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Clients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Data.Entities
{
    public class Note
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTimeOffset CreatedDate { get; set; }

        
        public virtual Client Client { get; set; }
        public int ClientId { get; set; }

        public virtual User User { get; set; }
        public int UserId { get; set; }
        

    }
}
