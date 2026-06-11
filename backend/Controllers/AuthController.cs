using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TeslaStore.Constants;
using TeslaStore.DAL.Models;
using TeslaStore.Data;
using TeslaStore.Models;

namespace TeslaStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _dbContext;

        public AuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IConfiguration configuration,
            AppDbContext dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "Введите имя пользователя и пароль." });
            }

            var user = new IdentityUser
            {
                UserName = model.Username,
                Email = string.IsNullOrWhiteSpace(model.Email)
                    ? $"{model.Username}@teslaparts.local"
                    : model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var message = string.Join(" ", result.Errors.Select(error => error.Description));
                return BadRequest(new { message });
            }

            var defaultRole = string.Equals(model.Username, "admin", StringComparison.OrdinalIgnoreCase)
                ? RoleNames.Admin
                : RoleNames.User;

            var roleResult = await _userManager.AddToRoleAsync(user, defaultRole);
            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                var message = $"Не удалось назначить роль пользователю: {string.Join(" ", roleResult.Errors.Select(error => error.Description))}";
                return BadRequest(new { message });
            }

            _dbContext.UserProfiles.Add(new UserProfileEntity
            {
                IdentityUserId = user.Id
            });
            await _dbContext.SaveChangesAsync();

            return Created(string.Empty, new { message = "Пользователь зарегистрирован." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            if (string.IsNullOrEmpty(role))
            {
                var defaultRole = string.Equals(model.Username, "admin", StringComparison.OrdinalIgnoreCase)
                    ? RoleNames.Admin
                    : RoleNames.User;

                await _userManager.AddToRoleAsync(user, defaultRole);
                role = defaultRole;
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, model.Username),
                new Claim(ClaimTypes.Role, role)
            };

            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key is not configured.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "TeslaStore",
                audience: _configuration["Jwt:Audience"] ?? "TeslaStore",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                username = user.UserName ?? model.Username,
                role
            });
        }
    }
}
