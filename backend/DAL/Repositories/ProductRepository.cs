using Microsoft.EntityFrameworkCore;
using TeslaStore.DAL.Models;
using TeslaStore.Data;

namespace TeslaStore.DAL.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<ProductEntity> GetAllProducts()
        {
            return _context.Products.AsNoTracking().OrderBy(product => product.Id).ToList();
        }

        public ProductEntity? GetById(int id)
        {
            return _context.Products.FirstOrDefault(product => product.Id == id);
        }

        public void Add(ProductEntity entity)
        {
            _context.Products.Add(entity);
            _context.SaveChanges();
        }

        public void Update(ProductEntity entity)
        {
            var existing = GetById(entity.Id);
            if (existing != null)
            {
                existing.Name = entity.Name;
                existing.Price = entity.Price;
                existing.Category = entity.Category;
                existing.Image = entity.Image;
                existing.FallbackImage = entity.FallbackImage;
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Products.Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}
