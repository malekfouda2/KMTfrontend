using System;

namespace KmtBackend.Models.DTOs.Permission
{
    /// <summary>
    /// Permission response DTO
    /// </summary>
    public class PermissionResponse
    {
        /// <summary>
        /// Permission's unique identifier
        /// </summary>
        public Guid Id { get; set; }
        
        /// <summary>
        /// Permission code in format "resource.action"
        /// </summary>
        public string Code { get; set; } = null!;
        
        /// <summary>
        /// Permission description
        /// </summary>
        public string? Description { get; set; }
        
        /// <summary>
        /// Permission description in Arabic
        /// </summary>
        public string? DescriptionAr { get; set; }
    }
}
