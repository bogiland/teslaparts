using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TeslaParts.Models;

namespace TeslaParts.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Эти свойства станут таблицами в базе данных
        public DbSet<Part> Parts { get; set; }
        public DbSet<Category> Categories { get; set; }
    }
}