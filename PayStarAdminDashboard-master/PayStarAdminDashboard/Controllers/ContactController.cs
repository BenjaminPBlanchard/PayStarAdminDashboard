using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Contacts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Controllers
{
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly DataContext dataContext;

        public ContactController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        private static Expression<Func<Contact, ContactDto>> MapEntityToDto()
        {
            return x => new ContactDto
            {
                Id = x.Id,
                Name = x.Name,
                Title = x.Title,
                MobilePhoneNumber = x.MobilePhoneNumber,
                OfficePhoneNumber = x.OfficePhoneNumber,
                IsPrimary = x.IsPrimary,
                IsDeleted =x.IsDeleted,
                ClientId = x.ClientId
            };
        }
        
        [HttpGet("GetByClientId/{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public IEnumerable<ContactDto> GetByClientId(int id)
        {
            return dataContext.Set<Contact>().Where(x => x.ClientId == id).Select(MapEntityToDto()).ToList();
        }

        [HttpGet]
        [Authorize(Roles = Roles.EmployeePlus)]
        public IEnumerable<ContactDto> GetAll()
        {
            return dataContext.Set<Contact>().Select(MapEntityToDto()).ToList();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ContactDto> GetById(int id)
        {
            var data = dataContext.Set<Contact>().Where(x => x.Id == id).Select(MapEntityToDto()).ToList();
            if(data == null)
            {
                return BadRequest();
            }
            return Ok(data);
        }

        [HttpPost]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ContactDto> Post(ContactCreateDto targetValue)
        {
            var data = dataContext.Set<Contact>().Add(new Contact
            {
                Name = targetValue.Name,
                Title = targetValue.Title,
                MobilePhoneNumber = targetValue.MobilePhoneNumber,
                OfficePhoneNumber = targetValue.OfficePhoneNumber,
                IsPrimary = targetValue.IsPrimary,
                IsDeleted = targetValue.IsDeleted,
                ClientId = targetValue.ClientId
            });
            dataContext.SaveChanges();

            return Created($"api/contact/{data.Entity.Id}", targetValue);
        }

        [HttpPut]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ContactDto> Edit(int id, ContactEditDto targetValue)
        {
            var data =dataContext.Set<Contact>().FirstOrDefault(x => x.Id == id);
            if(data == null || data.ClientId < 1)
            {
                return BadRequest();
            }
            data.Name = targetValue.Name;
            data.Title = targetValue.Title;
            data.MobilePhoneNumber = targetValue.MobilePhoneNumber;
            data.OfficePhoneNumber = targetValue.OfficePhoneNumber;
            data.IsPrimary = targetValue.IsPrimary;
            data.IsDeleted = targetValue.IsDeleted;
            data.ClientId = targetValue.ClientId;

            dataContext.SaveChanges();
            return Ok();
        }

        [HttpDelete]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult Delete(int id)
        {
            var data = dataContext.Set<Contact>().FirstOrDefault(x => x.Id == id);
            if(data == null)
            {
                return BadRequest();
            }
            dataContext.Set<Contact>().Remove(data);
            dataContext.SaveChanges();
            return Ok();
        }
    }
}
