using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PayStarAdminDashboard.Features.Authentication;
using PayStarAdminDashboard.Features.Authentication.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Controllers
{
    [ApiController]
    [Route("api/authentication")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;

        public AuthenticationController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserRoleDto>> Login(LoginDto dto)
        {
            var user = await userManager.FindByNameAsync(dto.Username);
            if (user == null)
            {
                return BadRequest();
            }

            var result = await signInManager.CheckPasswordSignInAsync(user, dto.Password, true);
            if (!result.Succeeded)
            {
                return BadRequest();
            }
            
            await signInManager.SignInAsync(user, false, "Password");

            var roles = await userManager.GetRolesAsync(user);

            return Ok(new UserRoleDto
            {
                Id = user.Id,
                Username = user.UserName,
                UserRoles = roles
            });;
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();

            return Ok();
        }

        
    }
}
