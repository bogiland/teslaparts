using TeslaStore.BLL.DTOs;

namespace TeslaStore.BLL.Services
{
    public interface IProductService
    {
        IEnumerable<ProductDTO> GetAllProducts();
        ProductDTO? GetProductById(int id);
        ProductDTO CreateProduct(ProductDTO productDto);
        void UpdateProduct(int id, ProductDTO productDto);
        void DeleteProduct(int id);
    }
}
