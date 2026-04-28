using System.Collections.Generic;

namespace TeslaParts.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        // Связь один-ко-многим (в одной категории много запчастей)
        public List<Part> Parts { get; set; } = new List<Part>();
    }
}