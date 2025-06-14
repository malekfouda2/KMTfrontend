using KmtBackend.Models.DTOs.Permission;
using System;
using System.Collections.Generic;

namespace KmtBackend.Models.DTOs.Role
{
    /// <summary>
    /// Role response DTO
    /// </summary>
    public class RoleResponse
    {
        /// <summary>
        /// Role's unique identifier
        /// </summary>
        public Guid Id { get; set; }
        
        /// <summary>
        /// Role name
        /// </summary>
        public string Name { get; set; } = null!;
        
        /// <summary>
        /// Role name in Arabic
        /// </summary>
        public string NameAr { get; set; } = null!;
        
        /// <summary>
        /// Role description
        /// </summary>
        public string? Description { get; set; }
        
        /// <summary>
        /// Role description in Arabic
        /// </summary>
        public string? DescriptionAr { get; set; }
        
        /// <summary>
        /// Permissions assigned to this role
        /// </summary>
        public ICollection<PermissionResponse> Permissions { get; set; } = new List<PermissionResponse>();
        
        /// <summary>
        /// Creation timestamp
        /// </summary>
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// Last update timestamp
        /// </summary>
        public DateTime? UpdatedAt { get; set; }
    }
}
