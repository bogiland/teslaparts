using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TeslaStore.Attributes;
using TeslaStore.Constants;
using TeslaStore.Models;

namespace TeslaStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private static readonly List<OrderModel> Orders = [];
        private static readonly object OrdersLock = new();
        private static readonly string[] AllowedStatuses = ["Ожидает", "Принят", "Не принято"];

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

            lock (OrdersLock)
            {
                if (string.Equals(role, RoleNames.Admin, StringComparison.Ordinal))
                {
                    return Ok(Orders.OrderByDescending(order => order.CreatedAt).ToList());
                }

                var userOrders = Orders
                    .Where(order => string.Equals(order.Username, username, StringComparison.OrdinalIgnoreCase))
                    .OrderByDescending(order => order.CreatedAt)
                    .ToList();

                return Ok(userOrders);
            }
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

            if (model.Items.Count == 0)
            {
                return BadRequest(new { message = "Корзина пуста." });
            }

            var items = model.Items
                .Where(item => item.ProductId > 0 && !string.IsNullOrWhiteSpace(item.Name) && item.Price >= 0 && item.Quantity > 0)
                .Select(item => new OrderItemModel
                {
                    ProductId = item.ProductId,
                    Name = item.Name.Trim(),
                    Price = item.Price,
                    Quantity = item.Quantity
                })
                .ToList();

            if (items.Count == 0)
            {
                return BadRequest(new { message = "Корзина пуста." });
            }

            OrderModel order;
            lock (OrdersLock)
            {
                var nextId = Orders.Count == 0 ? 1 : Orders.Max(existingOrder => existingOrder.Id) + 1;
                order = new OrderModel
                {
                    Id = nextId,
                    Username = username,
                    Items = items,
                    Total = items.Sum(item => item.Price * item.Quantity),
                    Status = "Ожидает",
                    CreatedAt = DateTime.UtcNow
                };

                Orders.Add(order);
            }

            return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
        }

        [HttpPut("{id:int}/status")]
        [AdminMod(RoleNames.Admin)]
        public IActionResult UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusModel model)
        {
            if (!AllowedStatuses.Contains(model.Status, StringComparer.Ordinal))
            {
                return BadRequest(new { message = "Недопустимый статус заказа." });
            }

            lock (OrdersLock)
            {
                var order = Orders.FirstOrDefault(existingOrder => existingOrder.Id == id);
                if (order == null)
                {
                    return NotFound(new { message = "Order not found" });
                }

                order.Status = model.Status;
                return Ok(order);
            }
        }
    }
}
