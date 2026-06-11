using System.ComponentModel.DataAnnotations;

namespace TeslaStore.Models
{
    public class CreateOrderModel
    {
        [Required]
        [MinLength(1)]
        public List<OrderItemModel> Items { get; set; } = [];
    }
}
