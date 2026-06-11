using System.ComponentModel.DataAnnotations;

namespace TeslaStore.Models
{
    public class UpdateOrderStatusModel
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;
    }
}
