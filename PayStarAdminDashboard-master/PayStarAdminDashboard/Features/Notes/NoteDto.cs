using PayStarAdminDashboard.Features.Clients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Notes
{
    public class NoteDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public int UserId { get; set; }
        public int ClientId { get; set; }
    }
}
