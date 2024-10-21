using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Features.Hubspot;
using Newtonsoft.Json;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic.CompilerServices;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Data;
using System.Security.Cryptography.X509Certificates;

namespace PayStarAdminDashboard.Controllers
{
    [Route("api/hubspot")]
    [ApiController]
    public class HubspotController : ControllerBase
    {
        private readonly DataContext dataContext;
        public HubspotController(DataContext _dataContext)
        {
            this.dataContext = _dataContext;
        }

        //string HapiKey = "f141d1a2-da24-4ba3-a496-fa19f879d058";
        readonly string engageUrl = "https://api.hubapi.com/engagements/v1/engagements/recent/modified?hapikey=";
        readonly string contactsUrl = "https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=";
        public string HubspotAPIKey { get; set; }

        [HttpGet("engagements")]
        public async Task<ActionResult<EngagementsDto>> GetEngagements(){

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = int.Parse(userIdString);

            var data = dataContext.Set<User>().Where(x => x.Id == userId).FirstOrDefault(x => x.Id == userId);
            HubspotAPIKey = data.HubspotAPIKey;
            
            EngagementsDto.Rootobject engageResults = new EngagementsDto.Rootobject();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(engageUrl + this.HubspotAPIKey))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();

                    engageResults = JsonConvert.DeserializeObject<EngagementsDto.Rootobject>(apiResponse);
                }
            }
            return Ok(engageResults);
        }
        [HttpGet("contacts")]
        public async Task<ActionResult<HContactsListDto>> GetContacts()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = int.Parse(userIdString);

            var data = dataContext.Set<User>().Where(x => x.Id == userId).FirstOrDefault(x => x.Id == userId);
            HubspotAPIKey = data.HubspotAPIKey;

            HContactsListDto.Rootobject contactsResults = new HContactsListDto.Rootobject();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(contactsUrl + this.HubspotAPIKey))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();

                    contactsResults = JsonConvert.DeserializeObject<HContactsListDto.Rootobject>(apiResponse);
                }
            }
            return Ok(contactsResults);
        }

    }
}
