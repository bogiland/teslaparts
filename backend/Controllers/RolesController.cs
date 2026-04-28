using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TeslaStore.Attributes;
using TeslaStore.Constants;
using TeslaStore.Models;

namespace TeslaStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AdminMod(RoleNames.Admin)]
    public class RolesController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public RolesController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public IActionResult GetAvailableRoles()
        {
            return Ok(RoleNames.All);
        }

        [HttpPut("users/{username}")]
        public async Task<IActionResult> AssignRole(string username, [FromBody] AssignRoleModel model)
        {
            if (!string.Equals(username, model.Username, StringComparison.Ordinal))
            {
                return BadRequest("Username in route and body must match");
            }

            if (!RoleNames.All.Contains(model.Role, StringComparer.Ordinal))
            {
                return BadRequest("Invalid role");
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                return BadRequest(removeResult.Errors);
            }

            var addResult = await _userManager.AddToRoleAsync(user, model.Role);
            if (!addResult.Succeeded)
            {
                return BadRequest(addResult.Errors);
            }

            return Ok(new
            {
                username,
                role = model.Role
            });
        }
    }
}
