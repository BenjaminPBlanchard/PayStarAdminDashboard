using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Data;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Authentication.Dtos;
using PayStarAdminDashboard.Features.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly DataContext dataContext;

        public UserController(UserManager<User> userManager, DataContext dataContext)
        {
            this.userManager = userManager;
            this.dataContext = dataContext;
        }

        private static Expression<Func<User, UserDto>> MapEntityToDto()
        {
            return x => new UserDto
            {
                Id = x.Id,
                UserName = x.UserName,
                Roles = x.Roles
            };
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<UserDto> GetById(int id)
        {
            var data = dataContext.Set<User>().Where(x => x.Id == id).Select(MapEntityToDto()).ToList();
            if(data == null)
            {
                return BadRequest();
            }
            return Ok(data);
        }

        [HttpGet()]
        [Authorize(Roles = Roles.EmployeePlus)]
        public ActionResult<ICollection<UserDto>> GetAll()
        {
            var data = dataContext.Set<User>().Select(MapEntityToDto()).ToList();
            if(data == null)
            {
                return BadRequest();
            }
            return Ok(data);
        }
    }
}
