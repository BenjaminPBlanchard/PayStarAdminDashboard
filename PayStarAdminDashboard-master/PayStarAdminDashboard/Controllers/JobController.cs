using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Data.Entities;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Jobs;


namespace PayStarAdminDashboard.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly IBackgroundJobClient backgroundJob;

        public JobController(DataContext dataContext, IBackgroundJobClient backgroundJob)
        {
            this.dataContext = dataContext;
            this.backgroundJob = backgroundJob;
        }

        private static Expression<Func<Jobs, JobDto>> MapEntityToDto()
        {
            return x => new JobDto
            {
                Id = x.Id,
                Description = x.Description,
                LastSuccess = x.LastSuccess,
                LastExecutionDate = x.LastExecutionDate,
                LastExecutionStatus = x.LastExecutionStatus
            };
        }

        [HttpGet]
        [Authorize(Roles = Roles.EmployeePlus)]
        [ProducesResponseType(typeof(List<JobGetDto>), (int)HttpStatusCode.OK)]
        public IEnumerable GetAll()
        {
            return dataContext.Set<Jobs>().Select(MapEntityToDto()).ToList();
        }


        [HttpGet("getAllSucceded-FailedCount")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<JobGetSuccededFailedCountDto> GetAllJobInfo()
        {
            var data = dataContext.Set<Jobs>();
            if (data == null) return BadRequest();

            long totalSuccesses = 0;
            long totalFails = 0;

            foreach (var job in data)
            {
                if (job.LastExecutionStatus == "Successful")
                {
                    totalSuccesses++;
                }
                else
                {
                    totalFails++;
                }
            }

            return Ok(new JobGetSuccededFailedCountDto
            {
                Failed = totalFails,
                Succeded = totalSuccesses
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        [ProducesResponseType(typeof(JobGetDto), (int)HttpStatusCode.OK)]
        public ActionResult<JobGetDto> GetById(int id)
        {
            var data = dataContext.Set<Jobs>().Where(x => x.Id == id).Select(MapEntityToDto()).FirstOrDefault();
            if (data == null)
            {
                return BadRequest();
            }
            return Ok(data);
        }


        [HttpPost]
        [ProducesResponseType(typeof(JobGetDto), (int)HttpStatusCode.Created)]
        public ActionResult Post([FromBody] JobCreateDto jobCreateDto)
        {
            var data = dataContext.Set<Jobs>().Add(new Jobs
            {
                Id = jobCreateDto.Id,
                Description = jobCreateDto.Description,
                LastSuccess = jobCreateDto.LastSuccess,
                LastExecutionDate = jobCreateDto.LastExecutionDate,
                LastExecutionStatus = jobCreateDto.LastExecutionStatus
            });
            dataContext.SaveChanges();

            return Created($"api/jobs/{data.Entity.Id}", jobCreateDto);
        }

       
        [HttpDelete]
        [Authorize(Roles = Roles.EmployeePlus)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public ActionResult Delete(int jobId)
        {
            var data = dataContext.Set<Jobs>().FirstOrDefault(x => x.Id == jobId);
            if (data == null)
            {
                return BadRequest();
            }
            dataContext.Set<Jobs>().Remove(data);
            dataContext.SaveChanges();
            return Ok();
        }
    }
}