using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.User
{
    /// <summary>
    /// Request for assigning roles to a user
    /// </summary>
    public class AssignRolesRequest
    {
        /// <summary>
        /// IDs of roles to assign
        /// </summary>
        [Required]
        public ICollection<Guid> RoleIds { get; set; } = new List<Guid>();
    }
}
