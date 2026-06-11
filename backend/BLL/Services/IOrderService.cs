using TeslaStore.Models;

namespace TeslaStore.BLL.Services
{
    public interface IOrderService
    {
        IEnumerable<OrderModel> GetOrders(string username, bool isAdmin);
        OrderModel? GetOrderById(int id, string username, bool isAdmin);
        OrderModel CreateOrder(string username, CreateOrderModel model);
        OrderModel? UpdateOrderStatus(int id, string status);
        bool DeleteOrder(int id);
    }
}
