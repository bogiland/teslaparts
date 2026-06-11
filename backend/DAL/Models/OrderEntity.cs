using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace TeslaStore.DAL.Models
{
    public class OrderEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string IdentityUserId { get; set; } = string.Empty;

        public IdentityUser? User { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;

        [Range(typeof(decimal), "0", "10000000")]
        public decimal Total { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<OrderItemEntity> Items { get; set; } = new List<OrderItemEntity>();
    }
}
