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
            if (user.Identity?.IsAuthenticated != true)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var claim = user.FindFirst(ClaimTypes.Role);
            if (claim == null)
            {
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
                context.Result = new ForbidResult();
                return;
            }

            if (roleLevels[claim.Value] < roleLevels[_requiredRole])
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
