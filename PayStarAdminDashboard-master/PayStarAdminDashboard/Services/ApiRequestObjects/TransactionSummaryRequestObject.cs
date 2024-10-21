using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Services.ApiRequestObjects
{
    [Serializable]
    public class TransactionSummaryRequestObject
    {
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public long TransactionCount { get; set; }
        public long NetRevenue { get; set; }
    }
}
