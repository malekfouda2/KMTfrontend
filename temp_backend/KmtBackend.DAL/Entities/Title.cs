using System.ComponentModel.DataAnnotations;

namespace KmtBackend.DAL.Entities
{
    public class Title : BaseEntity
    {
        [MaxLength(50)]
        public string Name { get; set; } = null!;

        [MaxLength(50)]
        public string NameAr { get; set; } = null!;

        [MaxLength(200)]
        public string Description { get; set; } = null!;

        [MaxLength(200)]
        public string DescriptionAr { get; set; } = null!;

        public virtual ICollection<User> Users { get; set; } = [];
    }
}
