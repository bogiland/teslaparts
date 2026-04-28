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
        
    
    }
}
