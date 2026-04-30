namespace TeslaStore.Models
{
    public class OrderModel
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<OrderItemModel> Items { get; set; } = [];
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
