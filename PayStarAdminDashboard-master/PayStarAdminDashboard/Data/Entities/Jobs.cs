using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Data.Entities
{
    public class Jobs
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTimeOffset LastSuccess { get; set; }
        public DateTimeOffset LastExecutionDate { get; set; }
        public string LastExecutionStatus { get; set; }
    }
}
