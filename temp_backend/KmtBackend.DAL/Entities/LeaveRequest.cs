using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using KmtBackend.Models.Enums;

namespace KmtBackend.DAL.Entities
{
    public class LeaveRequest : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [Required]
        public Guid LeaveTypeId { get; set; }

        [ForeignKey(nameof(LeaveTypeId))]
        public LeaveType LeaveType { get; set; } = null!;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public int Days { get; set; }

        public bool IsHourlyLeave { get; set; }

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public int? Month { get; set; }

        [Required]
        public LeaveRequestStatus Status { get; set; } = LeaveRequestStatus.Pending;

        public Guid? ProcessedById { get; set; }

        [ForeignKey(nameof(ProcessedById))]
        public User? ProcessedBy { get; set; }

        public DateTime? ProcessedDate { get; set; }

        [MaxLength(500)]
        public string? RejectionReason { get; set; }
    }
}
