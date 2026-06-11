using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TeslaStore.Attributes;
using TeslaStore.BLL.Services;
using TeslaStore.Constants;
using TeslaStore.Models;

namespace TeslaStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        [AdminMod(RoleNames.Visitor)]
        public IActionResult GetOrders()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(new { message = "Unauthorized" });
            }

            var orders = _orderService.GetOrders(username, string.Equals(role, RoleNames.Admin, StringComparison.Ordinal));
            return Ok(orders);
        }

        [HttpGet("{id:int}")]
        [AdminMod(RoleNames.Visitor)]
        public IActionResult GetOrderById(int id)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(new { message = "Unauthorized" });
            }

            var order = _orderService.GetOrderById(id, username, string.Equals(role, RoleNames.Admin, StringComparison.Ordinal));
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }

        [HttpPost]
        [AdminMod(RoleNames.Visitor)]
        public IActionResult CreateOrder([FromBody] CreateOrderModel model)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(new { message = "Unauthorized" });
            }

            try
            {
                var order = _orderService.CreateOrder(username, model);
                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:int}/status")]
        [AdminMod(RoleNames.Admin)]
        public IActionResult UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusModel model)
        {
            try
            {
                var order = _orderService.UpdateOrderStatus(id, model.Status);
                if (order == null)
                {
                    return NotFound(new { message = "Order not found" });
                }

                return Ok(order);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        [AdminMod(RoleNames.Admin)]
        public IActionResult DeleteOrder(int id)
        {
            var deleted = _orderService.DeleteOrder(id);
            if (!deleted)
            {
                return NotFound(new { message = "Order not found" });
            }

            return NoContent();
        }
    }
}
