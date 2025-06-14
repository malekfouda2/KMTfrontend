using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Role
{
    public class UpdateRoleRequest
    {
        [StringLength(50, MinimumLength = 2)]
        public string? Name { get; set; }
        
        [StringLength(50, MinimumLength = 2)]
        public string? NameAr { get; set; }
        
        [StringLength(200)]
        public string? Description { get; set; }

        [StringLength(200)]
        public string? DescriptionAr { get; set; }

        public ICollection<Guid>? PermissionIds { get; set; }
    }
}
