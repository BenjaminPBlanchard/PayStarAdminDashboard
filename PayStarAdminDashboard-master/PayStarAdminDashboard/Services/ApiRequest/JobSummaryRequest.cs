using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Data.Entities;
using PayStarAdminDashboard.Services.ApiRequestObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace PayStarAdminDashboard.Services.ApiRequest
{
    public interface IJobSummaryRequest
    {
        Task MakeRequest();
    }

    public class JobSummaryRequest : IJobSummaryRequest
    {
        private readonly DataContext dataContext;

        public JobSummaryRequest(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task MakeRequest()
        {
            var uri = "https://prod-paystar-api.azure-api.net/411/job-summaries";
            string keyName = "Subscription-Key";
            string key = "47a5ebf0d9544842b5cdb4ced530cc58";

            HttpService http = new HttpService(uri, keyName, key);
            dynamic response = http.Get();
            var responseList = response.ToObject<List<JobSummaryRequestObject>>();
            var data = dataContext.Set<Jobs>().ToList();

            string emailBody = "";
            
            foreach (var item in responseList)
            {
                string Description = item.Description;
                var job = data.FirstOrDefault(x => x.Description == Description);

                var dbClient = dataContext.Set<Jobs>();
                if (job == null)
                {
                    dbClient.Add(new Jobs
                    {
                        Description = item.Description,
                        LastSuccess = item.LastSuccessDate,
                        LastExecutionDate = item.LastExecutionDate,
                        LastExecutionStatus = item.LastExecutionStatus
                    });
                }
                else
                {
                    if (job.LastSuccess != item.LastSuccessDate ||
                        job.LastExecutionDate != item.LastExecutionDate ||
                        job.LastExecutionStatus != item.LastExecutionStatus)
                    {
                        job.LastSuccess = item.LastSuccessDate;
                        job.LastExecutionDate = item.LastExecutionDate;
                        job.LastExecutionStatus = item.LastExecutionStatus;
                    }
                }

                dataContext.SaveChanges();
            }
        }
    }
}
