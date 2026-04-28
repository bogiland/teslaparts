using AutoMapper;
using TeslaStore.DAL.Models;
using TeslaStore.BLL.DTOs;

namespace TeslaStore.BLL
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Настройка маппинга из Entity (Слой данных) в DTO (Слой бизнес-логики/Представления)
            // Используется для операции READ
            CreateMap<ProductEntity, ProductDTO>()
                // Вычисления и поведение (Бизнес-логика)
                .ForMember(dest => dest.FormattedPrice, opt => opt.MapFrom(src => $"${src.Price:F2}"))
                .ForMember(dest => dest.IsPremium, opt => opt.MapFrom(src => src.Price >= 500))
                .ForMember(dest => dest.TaxInfo, opt => opt.MapFrom(src => $"Включает налог: ${(src.Price * 0.2m):F2}"));

            // Настройка обратного маппинга из DTO в Entity
            // Используется для операций CREATE и UPDATE
            CreateMap<ProductDTO, ProductEntity>();
        }
    }
}
