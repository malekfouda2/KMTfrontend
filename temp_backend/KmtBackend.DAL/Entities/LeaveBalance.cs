using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace KmtBackend.DAL.Entities
{
    public class LeaveBalance : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [Required]
        public Guid LeaveTypeId { get; set; }

        [ForeignKey(nameof(LeaveTypeId))]
        public LeaveType LeaveType { get; set; } = null!;

        // The year this balance applies to
        [Required]
        public int Year { get; set; }

        // Total days entitled for this leave type
        [Required]
        public int TotalDays { get; set; }

        // Days already used
        [Required]
        public decimal UsedDays { get; set; }

        // Computed property for remaining days
        [NotMapped]
        public decimal RemainingDays => TotalDays - UsedDays;

        public DateTime NotUsedBefore { get; set; }
    }
}
