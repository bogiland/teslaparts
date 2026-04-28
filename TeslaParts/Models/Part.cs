namespace TeslaParts.Models
{
    public class Part
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        
        // Внешний ключ для категории
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}