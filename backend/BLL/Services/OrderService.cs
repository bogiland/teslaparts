using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TeslaStore.DAL.Models;
using TeslaStore.Data;
using TeslaStore.Models;

namespace TeslaStore.BLL.Services
{
    public class OrderService : IOrderService
    {
        private static readonly string[] AllowedStatuses = ["Ожидает", "Принят", "Не принято"];
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public OrderService(AppDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public IEnumerable<OrderModel> GetOrders(string username, bool isAdmin)
        {
            var query = _context.Orders
                .Include(order => order.Items)
                .AsNoTracking()
                .OrderByDescending(order => order.CreatedAt)
                .AsQueryable();

            if (!isAdmin)
            {
                query = query.Where(order => order.Username == username);
            }

            return query.ToList().Select(MapToModel).ToList();
        }

        public OrderModel? GetOrderById(int id, string username, bool isAdmin)
        {
            var query = _context.Orders
                .Include(order => order.Items)
                .AsNoTracking()
                .Where(order => order.Id == id);

            if (!isAdmin)
            {
                query = query.Where(order => order.Username == username);
            }

            var order = query.FirstOrDefault();
            return order == null ? null : MapToModel(order);
        }

        public OrderModel CreateOrder(string username, CreateOrderModel model)
        {
            var items = model.Items
                .Where(item => item.ProductId > 0 && !string.IsNullOrWhiteSpace(item.Name) && item.Price >= 0 && item.Quantity > 0)
                .Select(item => new OrderItemEntity
                {
                    ProductId = item.ProductId,
                    Name = item.Name.Trim(),
                    Price = item.Price,
                    Quantity = item.Quantity
                })
                .ToList();

            if (items.Count == 0)
            {
                throw new ArgumentException("Корзина пуста.");
            }

            var user = _userManager.FindByNameAsync(username).GetAwaiter().GetResult();
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            var order = new OrderEntity
            {
                Username = username,
                IdentityUserId = user.Id,
                Items = items,
                Total = items.Sum(item => item.Price * item.Quantity),
                Status = "Ожидает",
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            return MapToModel(order);
        }

        public OrderModel? UpdateOrderStatus(int id, string status)
        {
            if (!AllowedStatuses.Contains(status, StringComparer.Ordinal))
            {
                throw new ArgumentException("Недопустимый статус заказа.");
            }

            var order = _context.Orders.Include(x => x.Items).FirstOrDefault(x => x.Id == id);
            if (order == null)
            {
                return null;
            }

            order.Status = status;
            _context.SaveChanges();
            return MapToModel(order);
        }

        public bool DeleteOrder(int id)
        {
            var order = _context.Orders.Include(x => x.Items).FirstOrDefault(x => x.Id == id);
            if (order == null)
            {
                return false;
            }

            _context.Orders.Remove(order);
            _context.SaveChanges();
            return true;
        }

        private static OrderModel MapToModel(OrderEntity order)
        {
            return new OrderModel
            {
                Id = order.Id,
                Username = order.Username,
                Items = order.Items.Select(item => new OrderItemModel
                {
                    ProductId = item.ProductId,
                    Name = item.Name,
                    Price = item.Price,
                    Quantity = item.Quantity
                }).ToList(),
                Total = order.Total,
                Status = order.Status,
                CreatedAt = order.CreatedAt
            };
        }
    }
}
