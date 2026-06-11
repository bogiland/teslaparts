using System.ComponentModel.DataAnnotations;

namespace TeslaStore.DAL.Models
{
    public class OrderItemEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        public OrderEntity? Order { get; set; }

        [Required]
        public int ProductId { get; set; }

        public ProductEntity? Product { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Range(typeof(decimal), "0", "1000000")]
        public decimal Price { get; set; }

        [Range(1, 1000)]
        public int Quantity { get; set; }
    }
}
