using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Data.Entities;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Notes;

namespace PayStarAdminDashboard.Controllers
{
    [Route("api/note")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly DataContext dataContext;

        public NoteController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            
        }

        private static Expression<Func<Note, NoteDto>> MapEntityToDto()
        {
            return x => new NoteDto
            {
                Id = x.Id,
                Content = x.Content,
                CreatedDate = x.CreatedDate,
                UserId = x.UserId,
                ClientId = x.ClientId
            };
        }

        [HttpGet]
        [Authorize(Roles = Roles.EmployeePlus)]
        [ProducesResponseType(typeof(List<NoteGetDto>), (int)HttpStatusCode.OK)]
        public IEnumerable GetAll()
        {
            return dataContext.Set<Note>().Select(MapEntityToDto()).ToList();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        [ProducesResponseType(typeof(NoteGetDto), (int)HttpStatusCode.OK)]
        public ActionResult<NoteGetDto> GetById(int noteId)
        {
            var data = dataContext.Set<Note>().Where(x => x.Id == noteId).Select(MapEntityToDto()).FirstOrDefault();
            if (data == null)
            {
                return BadRequest();
            }
            return Ok(data);
        }

        [HttpGet("getRecentNotes")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<IEnumerable<NoteDto>> GetRecent()
        {
            List<NoteDto> returnList = new List<NoteDto>();
            var data = dataContext.Set<Note>();
            foreach (var note in data)
            {
                if ((DateTimeOffset.Now - note.CreatedDate).TotalDays < 7)
                {
                    returnList.Add(new NoteDto
                    {
                        Id = note.Id,
                        Content = note.Content,
                        CreatedDate = note.CreatedDate,
                        UserId = note.UserId,
                        ClientId = note.ClientId
                    });
                }
            }
            //var returnList = data.Where(x => (DateTimeOffset.Now - x.CreatedDate).TotalDays < 7).Select(MapEntityToDto()).ToList();
            return returnList;
        }
        
        
        [HttpGet("client-id/{clientId}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<NoteDto> GetByClientId(int clientId)
        {
            var data = dataContext.Set<Note>().Where(x => x.ClientId == clientId).Select(MapEntityToDto()).ToList();
            if(data == null)
            {
                BadRequest();
            }
            return Ok(data);
        }

        [HttpPost]
        [ProducesResponseType(typeof(NoteGetDto), (int)HttpStatusCode.Created)]
        public ActionResult Post([FromBody] NoteCreateDto noteCreateDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = int.Parse(userIdString);

            var data = dataContext.Set<Note>().Add(new Note
            {
                Content = noteCreateDto.Content,
                CreatedDate = noteCreateDto.CreatedDate,
                ClientId = noteCreateDto.ClientId,
                UserId = userId,
            });
            dataContext.SaveChanges();
            
            return Created($"api/note/{data.Entity.Id}", noteCreateDto);
        }

        [HttpPut]
        [Authorize(Roles = Roles.EmployeePlus)]
        [ProducesResponseType(typeof(NoteGetDto), (int)HttpStatusCode.OK)]
        public ActionResult Put(int noteId, [FromBody] NoteEditDto noteEditDto)
        {
            var data = dataContext.Set<Note>().FirstOrDefault(x => x.Id == noteId);
            if (data == null)
            {
                return BadRequest();
            }

            data.Content = noteEditDto.Content;
            data.CreatedDate = noteEditDto.CreatedDate;
            data.UserId = noteEditDto.UserId;
            data.ClientId = noteEditDto.ClientId;

            dataContext.SaveChanges();
            return Ok();
        }
        
        [HttpDelete]
        [Authorize(Roles = Roles.EmployeePlus)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public ActionResult Delete(int noteId)
        {
            var data = dataContext.Set<Note>().FirstOrDefault(x => x.Id == noteId);
            if (data == null)
            {
                return BadRequest();
            }
            dataContext.Set<Note>().Remove(data);
            dataContext.SaveChanges();
            return Ok();
        }
    }
}