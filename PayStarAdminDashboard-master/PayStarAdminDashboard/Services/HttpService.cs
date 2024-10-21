using System;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace PayStarAdminDashboard.Services
{
    public class HttpService
    {
        private readonly string _uri;
        private readonly bool _hasApiKey = false;
        private readonly string _apiKeyName;
        private readonly string _apiKeyValue;
        public HttpService(string uri, string apiKeyName = "" , string apiKeyValue = "")
        {
            this._uri = uri;
            if (apiKeyName != "" && apiKeyValue != "")
            {
                _hasApiKey = true;
                this._apiKeyName = apiKeyName;
                this._apiKeyValue = apiKeyValue;
            }
        }

        public dynamic Get(string extension = "")
        {
            using(var client = new HttpClient())
            {
                JArray response = null;
                client.BaseAddress = new Uri(_uri);
                
                if (_hasApiKey)
                {
                    client.DefaultRequestHeaders.Add(_apiKeyName, _apiKeyValue);
                }
                
                var responseTask = client.GetAsync(extension);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsStringAsync();
                    readTask.Wait();

                    if (readTask.Result.StartsWith("[") && readTask.Result.EndsWith("]"))
                    {
                        return ConvertToJsonArray(readTask.Result);
                    }
                    
                    return ConvertToJson(readTask.Result);
                }

                return null;
            }
        }

        private JArray ConvertToJsonArray(string input)
        {
            return JArray.Parse(input);
        }

        private JObject ConvertToJson(string input)
        {
            return JObject.Parse(input);
        }
    }
}