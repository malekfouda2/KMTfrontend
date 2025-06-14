using KmtBackend.DAL.Entities;
using KmtBackend.API.DTOs.Auth;
using Mapster;
using System.Globalization;
using KmtBackend.Models.DTOs.User;
using KmtBackend.Models.DTOs.Title;
using KmtBackend.Models.DTOs.Department;
using KmtBackend.Infrastructure.Helpers;

namespace KmtBackend.API.Mapping
{
    public class UserMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // User to UserResponse mapping
            config.NewConfig<User, UserResponse>()
                .Map(dest => dest.Department, src => src.Department == null ? null : new DepartmentResponse
                {
                    Id = src.Department.Id,
                    // Use Arabic name if Arabic culture is current
                    //Name = CultureInfo.CurrentCulture.Name.StartsWith("ar") && !string.IsNullOrEmpty(src.Department.NameAr)
                    //    ? src.Department.NameAr
                    //    : src.Department.Name,
                    //Description = CultureInfo.CurrentCulture.Name.StartsWith("ar") && !string.IsNullOrEmpty(src.Department.DescriptionAr)
                    //    ? src.Department.DescriptionAr
                    //    : src.Department.Description,
                    Name = src.Department.Name,
                    NameAr = src.Department.NameAr,
                    Description = src.Department.Description,
                    DescriptionAr = src.Department.DescriptionAr,
                    CreatedAt = src.Department.CreatedAt,
                    UpdatedAt = src.Department.UpdatedAt,
                    UserCount = src.Department.Users.Count
                })
                .Map(dest => dest.Title, src => src.Title == null ? null : new TitleResponse
                {
                    Id = src.Title.Id,
                    // Use Arabic name if Arabic culture is current
                    //Name = CultureInfo.CurrentCulture.Name.StartsWith("ar") && !string.IsNullOrEmpty(src.Title.NameAr)
                    //    ? src.Title.NameAr
                    //    : src.Title.Name,
                    //Description = CultureInfo.CurrentCulture.Name.StartsWith("ar") && !string.IsNullOrEmpty(src.Title.DescriptionAr)
                    //    ? src.Title.DescriptionAr
                    //    : src.Title.Description,
                    Name = src.Title.Name,
                    NameAr = src.Title.NameAr,
                    Description = src.Title.Description,
                    DescriptionAr = src.Title.DescriptionAr,
                    CreatedAt = src.Title.CreatedAt,
                    UpdatedAt = src.Title.UpdatedAt,
                    UserCount = src.Title.Users.Count
                });

            // User to UserDto mapping (for auth response)
            config.NewConfig<User, UserDto>()
                // Conditionally map department if exists
                .Map(dest => dest.Department, src => src.Department == null ? null : new DepartmentDto
                {
                    Id = src.Department.Id,
                    // Use Arabic name if Arabic culture is current
                    Name = CultureInfo.CurrentCulture.Name.StartsWith("ar") && !string.IsNullOrEmpty(src.Department.NameAr)
                        ? src.Department.NameAr
                        : src.Department.Name,
                    Description = CultureInfo.CurrentCulture.Name.StartsWith("ar") && !string.IsNullOrEmpty(src.Department.DescriptionAr)
                        ? src.Department.DescriptionAr
                        : src.Department.Description
                })
                .Map(dest => dest.Title, src => src.Title == null
                ? null
                : CultureInfo.CurrentCulture.Name.StartsWith("ar") && !string.IsNullOrEmpty(src.Department.NameAr)
                        ? src.Department.NameAr
                        : src.Department.Name);

            // CreateUserRequest to User mapping
            config.NewConfig<CreateUserRequest, User>()
                .Ignore(dest => dest.PasswordHash)
                .Map(dest => dest.CreatedAt, src => DateTime.UtcNow)
                .Map(dest => dest.PhoneNumber, src => PhoneNumberHelper.Normalize(src.PhoneNumber ?? ""));
        }
    }
}

