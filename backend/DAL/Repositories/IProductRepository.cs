using TeslaStore.DAL.Models;

namespace TeslaStore.DAL.Repositories
{
    public interface IProductRepository
    {
        IEnumerable<ProductEntity> GetAllProducts();
        ProductEntity? GetById(int id);
        void Add(ProductEntity entity);
        void Update(ProductEntity entity);
        void Delete(int id);
    }
}
