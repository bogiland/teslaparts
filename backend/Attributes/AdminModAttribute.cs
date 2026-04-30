using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using TeslaStore.Constants;

namespace TeslaStore.Attributes
{
    public class AdminModAttribute : ActionFilterAttribute
    {
        private readonly string _requiredRole;

        public AdminModAttribute(string requiredRole = RoleNames.User)
        {
            _requiredRole = requiredRole;
            Order = int.MinValue;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;
            var logger = context.HttpContext.RequestServices.GetService(typeof(ILogger<AdminModAttribute>)) as ILogger<AdminModAttribute>;

            if (user.Identity?.IsAuthenticated != true)
            {
                logger?.LogWarning("Unauthorized access attempt - user not authenticated");
                context.Result = new UnauthorizedResult();
                return;
            }

            var claim = user.FindFirst(ClaimTypes.Role);
            var username = user.FindFirstValue(ClaimTypes.Name);
            
            logger?.LogInformation($"User {username} accessing with role claim: {claim?.Value ?? "NULL"}");

            if (claim == null)
            {
                logger?.LogWarning($"Access denied for {username} - no role claim found");
                context.Result = new ForbidResult();
                return;
            }

            var roleLevels = new Dictionary<string, int>(StringComparer.Ordinal)
            {
                { RoleNames.Admin, 3 },
                { RoleNames.User, 2 },
                { RoleNames.Visitor, 1 }
            };

            if (!roleLevels.ContainsKey(_requiredRole) || !roleLevels.ContainsKey(claim.Value))
            {
                logger?.LogWarning($"Access denied for {username} - invalid role. Required: {_requiredRole}, User role: {claim.Value}");
                context.Result = new ForbidResult();
                return;
            }

            if (roleLevels[claim.Value] < roleLevels[_requiredRole])
            {
                logger?.LogWarning($"Access denied for {username} - insufficient privileges. Required level: {roleLevels[_requiredRole]}, User level: {roleLevels[claim.Value]}");
                context.Result = new ForbidResult();
                return;
            }

            logger?.LogInformation($"Access granted for {username}");
        }
    }
}
