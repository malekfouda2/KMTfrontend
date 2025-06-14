using System.ComponentModel.DataAnnotations;

namespace KmtBackend.DAL.Entities
{
    public class Role : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string NameAr { get; set; } = null!;

        [MaxLength(200)]
        public string? Description { get; set; }

        [MaxLength(200)]
        public string? DescriptionAr { get; set; }

        public virtual ICollection<User> User { get; set; } = [];

        public virtual ICollection<Permission> Permissions { get; set; } = [];
    }
}
