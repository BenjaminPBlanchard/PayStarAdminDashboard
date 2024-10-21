using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Data.Entities.SalesAgency;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.SalesAgencys;
using PayStarAdminDashboard.Features.SalesRepresentatives;

namespace PayStarAdminDashboard.Controllers
{
    [Route("api/sales-agency")]
    [ApiController]
    public class SalesAgencyController : ControllerBase
    {

        private readonly DataContext dataContext;
        public SalesAgencyController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        private static Expression<Func<SalesAgency, SalesAgencyDto>> MapEntityToDto()
        {
            return x => new SalesAgencyDto
            {
                Id = x.Id,
                Name = x.Name
            };
        }

        [HttpGet]
        [Authorize(Roles = Roles.EmployeePlus)]
        public IEnumerable<SalesAgencyDto> GetAll()
        {
            return dataContext.Set<SalesAgency>().Select(MapEntityToDto()).ToList();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<SalesAgencyDto> GetById(int id)
        {
            var data = dataContext.Set<SalesAgency>().Where(x => x.Id == id).Select(MapEntityToDto()).ToList();
            if (data == null)
            {
                return BadRequest();
            }
            return Ok(data);
        }

        [HttpPost]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<SalesAgencyDto> Create(CreateSalesAgencyDto targetValue)
        {
            var data = dataContext.Set<SalesAgency>().Add(new SalesAgency
            {
                Name = targetValue.Name
            });
            dataContext.SaveChanges();
            targetValue.Id = data.Entity.Id;
            return Created($"api/sales-agency/{data.Entity.Id}", targetValue);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<SalesAgencyDto> Edit(int id, EditSalesAgencyDto targetValue)
        {
            var data = dataContext.Set<SalesAgency>().FirstOrDefault(x => x.Id == id);
            if (data == null)
            {
                return BadRequest();
            }
            data.Name = targetValue.Name;
            dataContext.SaveChanges();
            return Ok();
        }

        [HttpDelete]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<SalesAgencyDto> Delete(int id)
        {
            var data = dataContext.Set<SalesAgency>().FirstOrDefault(x => x.Id == id);
            if (data == null)
            {
                return BadRequest();
            }
            dataContext.Set<SalesAgency>().Remove(data);
            dataContext.SaveChanges();
            return Ok();
        }
    }
}
