using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Permission;
using KmtBackend.Models.DTOs.Role;
using Mapster;

namespace KmtBackend.API.Mapping
{
    /// <summary>
    /// Mapster configuration for Role entity
    /// </summary>
    public class RoleMappingConfig : IRegister
    {
        /// <summary>
        /// Register role mapping configurations
        /// </summary>
        /// <param name="config">Type adapter configuration</param>
        public void Register(TypeAdapterConfig config)
        {
            // Map Role to RoleResponse
            config.NewConfig<Role, RoleResponse>()
                // Map basic properties
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.NameAr, src => src.NameAr)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.DescriptionAr, src => src.DescriptionAr)
                .Map(dest => dest.CreatedAt, src => src.CreatedAt)
                .Map(dest => dest.UpdatedAt, src => src.UpdatedAt)
                // Map permissions collection
                .Map(dest => dest.Permissions, src => src.Permissions);
            
            // Map Permission to PermissionResponse
            config.NewConfig<Permission, PermissionResponse>()
                // Map basic properties
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Code, src => src.Code)
                // Map description based on current culture
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.DescriptionAr, src => src.DescriptionAr);
        }
    }
}
