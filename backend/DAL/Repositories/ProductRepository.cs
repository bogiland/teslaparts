using TeslaStore.DAL.Models;

namespace TeslaStore.DAL.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private static List<ProductEntity> _products = new List<ProductEntity>
        {
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
        };

        public IEnumerable<ProductEntity> GetAllProducts()
        {
            return _products;
        }

        public ProductEntity? GetById(int id)
        {
            return _products.FirstOrDefault(p => p.Id == id);
        }

        public void Add(ProductEntity entity)
        {
            entity.Id = _products.Any() ? _products.Max(p => p.Id) + 1 : 1;
            _products.Add(entity);
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
            }
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _products.Remove(entity);
            }
        }
    }
}
