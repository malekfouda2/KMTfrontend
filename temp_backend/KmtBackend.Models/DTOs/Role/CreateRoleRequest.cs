using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Role
{
    /// <summary>
    /// Request for creating a new role
    /// </summary>
    public class CreateRoleRequest
    {
        /// <summary>
        /// Role name
        /// </summary>
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; } = null!;
        
        /// <summary>
        /// Role name in Arabic
        /// </summary>
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string NameAr { get; set; } = null!;
        
        /// <summary>
        /// Role description
        /// </summary>
        [StringLength(200)]
        public string? Description { get; set; }
        
        /// <summary>
        /// Role description in Arabic
        /// </summary>
        [StringLength(200)]
        public string? DescriptionAr { get; set; }
        
        /// <summary>
        /// IDs of permissions to assign to this role
        /// </summary>
        public ICollection<Guid> PermissionIds { get; set; } = new List<Guid>();
    }
}
