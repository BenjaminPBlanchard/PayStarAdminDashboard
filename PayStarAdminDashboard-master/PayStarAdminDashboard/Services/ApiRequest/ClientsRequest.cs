using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Web;
using PayStarAdminDashboard.Data.Entities;
using Newtonsoft.Json;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Features.Clients;
using PayStarAdminDashboard.Services.ApiRequestObjects;

namespace PayStarAdminDashboard.Services.ApiRequest
{

    public interface IClientsRequest
    {
        Task MakeRequest();
    }

    public class ClientsRequest : IClientsRequest
    {
        private readonly DataContext dataContext;
        public  ClientsRequest(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task MakeRequest()
        {
            int paystarVersionNumber = 1;
            while (paystarVersionNumber < 3)
            {
                string uri;
                if (paystarVersionNumber == 1)
                {
                    uri =
                        "https://prod-paystar-api.azure-api.net/411/clients?paystarVersion=1&Subscription-Key=47a5ebf0d9544842b5cdb4ced530cc58";
                }
                else
                {
                    uri =
                        "https://prod-paystar-api.azure-api.net/411/clients?paystarVersion=2&Subscription-Key=47a5ebf0d9544842b5cdb4ced530cc58";
                }

                //string keyName = "Subscription-Key";
                //string key = "47a5ebf0d9544842b5cdb4ced530cc58";

                HttpService http = new HttpService(uri);
                dynamic response = http.Get();
                dynamic responseList = null;
                if (paystarVersionNumber == 1)
                {
                     responseList = response.ToObject<List<ClientV1RequestObject>>();
                }
                else
                {
                    responseList = response.ToObject<List<ClientV2RequestObject>>();
                }
                
                var data = dataContext.Set<Client>();

                foreach (var item in responseList)
                {
                    string itemName = item.OrgName + ": " + item.BusinessUnitName;
                    var client = data.FirstOrDefault(x => x.Name == itemName);
                    
                    if (paystarVersionNumber == 1)
                    {
                        if (client == null)
                        {
                            data.Add(new Client
                            {
                                Name = itemName,
                                IvrPhoneNumber = "0000000000",
                                PhoneNumber = "0000000000",
                                BillingSystem = "",
                                VersionOneId = item.PayStarClientId.ToString(),
                                VersionTwoId = null,
                                IsMigrating = false,
                                StreetAddress = "",
                                City = "",
                                State = "",
                                Zip = "",
                            });
                        }
                        else
                        {
                            if (client.Name != itemName ||
                                client.VersionOneId != item.PayStarClientId.ToString() 
                                )
                            {
                                client.Name = itemName;
                                client.VersionOneId = item.PayStarClientId.ToString();
                                client.VersionTwoId = null;
                            }
                        }
                        dataContext.SaveChanges();
                    }
                    else
                    {
                        if (client == null)
                        {
                            data.Add(new Client
                            {
                                Name = itemName,
                                IvrPhoneNumber = "0000000000",
                                PhoneNumber = "0000000000",
                                BillingSystem = "",
                                VersionOneId = item.PayStarClientId.ToString(),
                                VersionTwoId = item.Slug,
                                IsMigrating = false,
                                StreetAddress = "",
                                City = "",
                                State = "",
                                Zip = "",
                            });
                        }
                        else
                        {
                            if (client.Name != itemName ||
                                client.VersionOneId != item.PayStarClientId.ToString() ||
                                client.VersionTwoId != item.Slug)
                            {
                                client.Name = itemName;
                                client.VersionOneId = item.PayStarClientId.ToString();
                                client.VersionTwoId = item.Slug;
                            }
                        }

                        dataContext.SaveChanges();
                    }
                }

                paystarVersionNumber++;
            }
        }
    }
}
