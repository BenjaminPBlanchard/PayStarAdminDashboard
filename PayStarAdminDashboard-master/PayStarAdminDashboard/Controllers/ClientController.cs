using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Clients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Controllers
{
    [Route("api/client")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly DataContext dataContext;
        public ClientController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        private static Expression<Func<Client, ClientDto>> MapEntityToDto()
        {
            return x => new ClientDto
            {
                Id = x.Id,
                IvrPhoneNumber = x.IvrPhoneNumber,
                PhoneNumber = x.PhoneNumber,
                Name = x.Name,
                BillingSystem = x.BillingSystem,
                VersionOneId = x.VersionOneId,
                VersionTwoId = x.VersionTwoId,
                IsMigrating = x.IsMigrating,
                StreetAddress = x.StreetAddress,
                City = x.City,
                State = x.State,
                Country = x.Country,
                Zip = x.Zip,
                TransactionCount = x.TransactionCount,
                NetRevenue = x.NetRevenue
            };
        }

        [HttpGet]
        [Authorize(Roles = Roles.EmployeePlus)]
        public IEnumerable<ClientDto> GetAll()
        {
            return dataContext.Set<Client>().Select(MapEntityToDto()).ToList();
        }

        [HttpGet("transactionInfo")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ClientGetTransactionsDto> GetAllTransactionInfo()
        {
            var data = dataContext.Set<Client>();
            if (data == null) return BadRequest();
            
            long totalNetRevenue = 0;
            long totalNumberOfTransactions = 0;
            
            foreach (var client in data)
            {
                totalNetRevenue += client.NetRevenue;
                totalNumberOfTransactions += client.TransactionCount;
            }

            return Ok(new ClientGetTransactionsDto
            {
                RevenueTotal = totalNetRevenue,
                TransactionCountTotal = totalNumberOfTransactions
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ClientDto> GetById(int id)
        {
            var data = dataContext.Set<Client>().Where(x => x.Id == id).Select(MapEntityToDto()).ToList();
            if (data == null)
            {
                return BadRequest();
            }
            return Ok(data);
        }

        [HttpPost]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ClientDto> Create(ClientCreateDto targetValue)
        {
            var data = dataContext.Set<Client>().Add(new Client
            {
                Name = targetValue.Name,
                IvrPhoneNumber = targetValue.IvrPhoneNumber,
                PhoneNumber = targetValue.PhoneNumber,
                BillingSystem = targetValue.BillingSystem,
                VersionOneId = targetValue.VersionOneId,
                VersionTwoId = targetValue.VersionTwoId,
                IsMigrating = targetValue.IsMigrating,
                StreetAddress = targetValue.StreetAddress,
                City = targetValue.City,
                State = targetValue.State,
                Country = targetValue.Country,
                Zip = targetValue.Zip,
            });
            dataContext.SaveChanges();
            
            return Created($"api/client/{data.Entity.Id}", targetValue);
        }

        [HttpPut]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ClientDto> Edit(int id,ClientEditDto targetValue)
        {
            var data = dataContext.Set<Client>().FirstOrDefault(x => x.Id == id);
            if(data == null)
            {
                return BadRequest();
            }
            data.Name = targetValue.Name;
            data.IvrPhoneNumber = targetValue.IvrPhoneNumber;
            data.PhoneNumber = targetValue.PhoneNumber;
            data.BillingSystem = targetValue.BillingSystem;
            data.VersionOneId = targetValue.VersionOneId;
            data.VersionTwoId = targetValue.VersionTwoId;
            data.IsMigrating = targetValue.IsMigrating;
            data.StreetAddress = targetValue.StreetAddress;
            data.City = targetValue.City;
            data.State = targetValue.State;
            data.Country = targetValue.Country;
            data.Zip = targetValue.Zip;

            dataContext.SaveChanges();
            return Ok();
        }

        [HttpDelete]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ClientDto> Delete(int id)
        {
            var data = dataContext.Set<Client>().FirstOrDefault(x => x.Id == id);
            if(data == null)
            {
                return BadRequest();
            }
            dataContext.Set<Client>().Remove(data);
            dataContext.SaveChanges();
            return Ok();
        }
    }
}
