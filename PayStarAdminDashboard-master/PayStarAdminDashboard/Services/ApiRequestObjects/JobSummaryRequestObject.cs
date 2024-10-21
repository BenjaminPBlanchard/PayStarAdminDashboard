using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Services.ApiRequestObjects
{
    public class JobSummaryRequestObject
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTimeOffset LastSuccessDate { get; set; }
        public DateTimeOffset LastExecutionDate { get; set; }
        public string LastExecutionStatus { get; set; }

    }
}
