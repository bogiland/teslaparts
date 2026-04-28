using AutoMapper;
using TeslaStore.BLL.DTOs;
using TeslaStore.DAL.Models;
using TeslaStore.DAL.Repositories;

namespace TeslaStore.BLL.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public IEnumerable<ProductDTO> GetAllProducts()
        {
            // 1. Получаем объекты из уровня доступа к данным (DAL)
            var entities = _repository.GetAllProducts();

            // 2. Бизнес-логика: здесь могут быть вычисления, фильтрация и т.д.
            // В данном случае мы используем AutoMapper для преобразования Entity в DTO
            var dtos = _mapper.Map<IEnumerable<ProductDTO>>(entities);

            // 3. Передаем DTO на уровень представления
            return dtos;
        }

        public ProductDTO? GetProductById(int id)
        {
            var entity = _repository.GetById(id);
            if (entity == null) return null;
            
            return _mapper.Map<ProductDTO>(entity);
        }

        public ProductDTO CreateProduct(ProductDTO productDto)
        {
            // Пример бизнес-логики: проверка валидности
            if (productDto.Price < 0)
            {
                throw new ArgumentException("Цена товара не может быть отрицательной.");
            }

            // Маппинг DTO -> Entity
            var entity = _mapper.Map<ProductEntity>(productDto);
            
            // Передаем в слой доступа к данным
            _repository.Add(entity);
            
            // Возвращаем созданный объект обратно как DTO
            return _mapper.Map<ProductDTO>(entity);
        }

        public void UpdateProduct(int id, ProductDTO productDto)
        {
            var existingEntity = _repository.GetById(id);
            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Товар не найден.");
            }

            if (productDto.Price < 0)
            {
                throw new ArgumentException("Цена товара не может быть отрицательной.");
            }

            // Обновляем данные сущности из DTO
            _mapper.Map(productDto, existingEntity);
            existingEntity.Id = id; // Защита от изменения ID

            _repository.Update(existingEntity);
        }

        public void DeleteProduct(int id)
        {
            var existingEntity = _repository.GetById(id);
            if (existingEntity == null)
            {
                throw new KeyNotFoundException("Товар не найден.");
            }

            _repository.Delete(id);
        }
    }
}
