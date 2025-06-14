using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KmtBackend.DAL.Entities
{
    public class MissionAssignment : BaseEntity
    {
        [Required]
        public Guid MissionId { get; set; }
        
        [ForeignKey(nameof(MissionId))]
        public Mission Mission { get; set; } = null!;
        
        [Required]
        public Guid UserId { get; set; }
        
        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;
        
        [Required]
        public Guid AssignedById { get; set; }
        
        [ForeignKey(nameof(AssignedById))]
        public User AssignedBy { get; set; } = null!;
    }
}