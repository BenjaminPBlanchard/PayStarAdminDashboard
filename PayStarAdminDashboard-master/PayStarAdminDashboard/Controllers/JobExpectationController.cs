using System;
using System.Collections;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Data.Entities;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.JobExpectation;

namespace PayStarAdminDashboard.Controllers
{
    [Route("api/jobExpectations")]
    [ApiController]
    public class JobExpectationController : ControllerBase
    {
        private readonly DataContext dataContext;

        public JobExpectationController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        private static Expression<Func<JobExpectation, JobExpectationDto>> MapEntityToDto()
        {
            return x => new JobExpectationDto
            {
                Id = x.Id,
                Days = x.Days,
                Hours = x.Hours,
                JobId = x.JobId
            };
        }

        [HttpPost]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<JobExpectationDto> Create(JobExpectationCreateDto targetValue)
        {
            var data = dataContext.Set<JobExpectation>().Add(new JobExpectation
            {
                Days = targetValue.Days,
                Hours = targetValue.Hours,
                JobId = targetValue.JobId
            });
            dataContext.SaveChanges();

            return Created($"api/jobExpectations/{data.Entity.Id}", targetValue);
        }

        [HttpPut]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<JobExpectationDto> Edit(int id, JobExpectationEditDto targetValue)
        {
            var data = dataContext.Set<JobExpectation>().FirstOrDefault(x => x.Id == id);
            if (data == null)
            {
                return BadRequest();
            }

            data.Days = targetValue.Days;
            data.Hours = targetValue.Hours;
            data.JobId = targetValue.JobId;

            dataContext.SaveChanges();

            return Ok();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]

        public ActionResult<JobExpectationDto> GetById(int id)
        {
            var data = dataContext.Set<JobExpectation>().Where(x => x.Id == id).Select(MapEntityToDto()).FirstOrDefault();
            if (data == null)
            {
                return BadRequest();
            }
            return Ok(data);
        }
        
        [HttpGet("job-id")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<JobExpectationDto> GetByJobId(int id)
        {
            var data = dataContext.Set<JobExpectation>().Where(x => x.JobId == id).Select(MapEntityToDto()).ToList().FirstOrDefault();
            if(data == null)
            {
                BadRequest();
            }
            return Ok(data);
        }

        [HttpGet]
        [Authorize(Roles = Roles.EmployeePlus)]
        public IEnumerable GetAll()
        {
            return dataContext.Set<JobExpectation>().Select(MapEntityToDto()).ToList();
        }

        [HttpDelete]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult Delete(int id)
        {
            var data = dataContext.Set<JobExpectation>().FirstOrDefault(x => x.Id == id);
            if (data == null)
            {
                return BadRequest();
            }

            dataContext.Set<JobExpectation>().Remove(data);
            dataContext.SaveChanges();
            return Ok();
        }
    }
}