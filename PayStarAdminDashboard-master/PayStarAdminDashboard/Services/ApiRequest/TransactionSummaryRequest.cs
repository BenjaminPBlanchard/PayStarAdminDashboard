using PayStarAdminDashboard.Services.ApiRequestObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Features.Clients;

namespace PayStarAdminDashboard.Services.ApiRequest
{
    public interface ITransactionSummaries
    {
        Task MakeRequest();
    }

    public class TransactionSummaryRequest : ITransactionSummaries
    {
        private readonly DataContext dataContext;
        public TransactionSummaryRequest(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }
        
        public async Task MakeRequest()
        {
            string uri = "https://prod-paystar-api.azure-api.net/411/transaction-summaries";
            string keyName = "Subscription-Key";
            string key = "47a5ebf0d9544842b5cdb4ced530cc58";

            var data = dataContext.Set<Client>().ToList();
            HttpService httpService = new HttpService(uri, keyName, key);

            foreach (var client in data)
            {
                int payStarVersion = 0;
                string payStarId = client.VersionOneId;

                if (payStarId != null)
                {
                    payStarVersion = client.VersionTwoId != null ? 2 : 1;
                
                    dynamic response = httpService.Get($"?paystarVersion={payStarVersion}&paystarClientId={payStarId}&daysToInclude=7&");
                    if (response != null)
                    {
                        var responseObject = response.ToObject<TransactionSummaryRequestObject>();
                        var dbClient = dataContext.Set<Client>().FirstOrDefault(x => x.VersionOneId == client.VersionOneId);

                        dbClient.TransactionCount = responseObject.TransactionCount;
                        dbClient.NetRevenue = responseObject.NetRevenue;
                
                        await dataContext.SaveChangesAsync();    
                    }
                }
            }
        }
    }
}
