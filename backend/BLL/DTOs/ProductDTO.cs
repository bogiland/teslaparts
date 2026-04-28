namespace TeslaStore.BLL.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public string? Image { get; set; }
        public string? FallbackImage { get; set; }
        
        // Дополнительные поля для демонстрации бизнес-логики (поведения и вычислений)
        public string? FormattedPrice { get; set; }
        public bool IsPremium { get; set; }
        public string? TaxInfo { get; set; }
    }
}
