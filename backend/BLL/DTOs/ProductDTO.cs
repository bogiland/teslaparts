using System.ComponentModel.DataAnnotations;

namespace TeslaStore.BLL.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Range(typeof(decimal), "0.01", "1000000")]
        public decimal Price { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Image { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string FallbackImage { get; set; } = string.Empty;
        
        // Дополнительные поля для демонстрации бизнес-логики (поведения и вычислений)
        public string? FormattedPrice { get; set; }
        public bool IsPremium { get; set; }
        public string? TaxInfo { get; set; }
    }
}
