using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TeslaStore.DAL.Models;

namespace TeslaStore.Data
{
    public class AppDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ProductEntity> Products => Set<ProductEntity>();
        public DbSet<OrderEntity> Orders => Set<OrderEntity>();
        public DbSet<OrderItemEntity> OrderItems => Set<OrderItemEntity>();
        public DbSet<UserProfileEntity> UserProfiles => Set<UserProfileEntity>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ProductEntity>(entity =>
            {
                entity.ToTable("Products");
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Name).IsRequired().HasMaxLength(200);
                entity.Property(x => x.Price).HasPrecision(18, 2);
                entity.Property(x => x.Category).IsRequired().HasMaxLength(50);
                entity.Property(x => x.Image).IsRequired().HasMaxLength(500);
                entity.Property(x => x.FallbackImage).IsRequired().HasMaxLength(500);
                entity.HasMany(x => x.OrderItems)
                    .WithOne(x => x.Product)
                    .HasForeignKey(x => x.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasData(
                    new ProductEntity { Id = 1, Name = "Передний бампер Tesla Model 3", Price = 450, Category = "exterior", Image = "/images/bumper.jpg", FallbackImage = "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 2, Name = "Аэродинамические диски 18\" Model 3/Y", Price = 800, Category = "exterior", Image = "/images/wheels.jpg", FallbackImage = "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 3, Name = "Штурвал (Yoke) Tesla Model S/X", Price = 1200, Category = "interior", Image = "/images/yoke.webp", FallbackImage = "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 4, Name = "Накладка на центральную консоль", Price = 45, Category = "interior", Image = "/images/console.webp", FallbackImage = "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 5, Name = "Зарядная станция Wall Connector", Price = 425, Category = "electronics", Image = "/images/charger.jpg", FallbackImage = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 6, Name = "Ключ-карта (Key Card)", Price = 35, Category = "electronics", Image = "/images/keycard.jpg", FallbackImage = "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 7, Name = "Защитное стекло для экрана", Price = 35, Category = "accessories", Image = "/images/screen-protector.webp", FallbackImage = "https://images.unsplash.com/photo-1561580125-028ce3bf7b02?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 8, Name = "HEPA фильтр салона", Price = 110, Category = "maintenance", Image = "/images/filter.jpg", FallbackImage = "https://images.unsplash.com/photo-1604061986761-d9d0cc41b0d1?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 9, Name = "Всепогодные коврики салона", Price = 225, Category = "accessories", Image = "/images/mats.jpg", FallbackImage = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 10, Name = "Комплект тормозных колодок", Price = 150, Category = "maintenance", Image = "/images/brakes.jpg", FallbackImage = "https://images.unsplash.com/photo-1486262715619-670810a044e1?auto=format&fit=crop&w=800&q=80" },
                    new ProductEntity { Id = 11, Name = "Рычаг передней подвески", Price = 320, Category = "maintenance", Image = "/images/suspension.jpg", FallbackImage = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" }
                );
            });

            builder.Entity<OrderEntity>(entity =>
            {
                entity.ToTable("Orders");
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Username).IsRequired().HasMaxLength(100);
                entity.Property(x => x.IdentityUserId).IsRequired();
                entity.Property(x => x.Status).IsRequired().HasMaxLength(50);
                entity.Property(x => x.Total).HasPrecision(18, 2);
                entity.HasOne(x => x.User)
                    .WithMany()
                    .HasForeignKey(x => x.IdentityUserId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasMany(x => x.Items)
                    .WithOne(x => x.Order)
                    .HasForeignKey(x => x.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<OrderItemEntity>(entity =>
            {
                entity.ToTable("OrderItems");
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Name).IsRequired().HasMaxLength(200);
                entity.Property(x => x.Price).HasPrecision(18, 2);
            });

            builder.Entity<UserProfileEntity>(entity =>
            {
                entity.ToTable("UserProfiles");
                entity.HasKey(x => x.Id);
                entity.Property(x => x.IdentityUserId).IsRequired();
                entity.Property(x => x.Phone).HasMaxLength(32);
                entity.HasIndex(x => x.IdentityUserId).IsUnique();
                entity.HasOne(x => x.User)
                    .WithOne()
                    .HasForeignKey<UserProfileEntity>(x => x.IdentityUserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
