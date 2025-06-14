using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Role
{
    /// <summary>
    /// Request for assigning permissions to a role
    /// </summary>
    public class AssignPermissionsRequest
    {
        /// <summary>
        /// IDs of permissions to assign
        /// </summary>
        [Required]
        public ICollection<Guid> PermissionIds { get; set; } = new List<Guid>();
    }
}
