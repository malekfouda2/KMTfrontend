using System.ComponentModel.DataAnnotations;

namespace KmtBackend.DAL.Entities
{
    public class Permission : BaseEntity
    {   
        /// <summary>
        /// Permission code in format "resource.action" (e.g., "users.create")
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = null!;
        
        /// <summary>
        /// Description of what this permission allows
        /// </summary>
        [MaxLength(200)]
        public string? Description { get; set; }

        /// <summary>
        /// Arabic Description of what this permission allows
        /// </summary>
        [MaxLength(200)]
        public string? DescriptionAr { get; set; }

        /// <summary>
        /// Collection of roles that have this permission
        /// </summary>
        public virtual ICollection<Role> Role { get; set; } = [];
    }
}
