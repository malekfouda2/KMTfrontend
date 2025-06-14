using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Leave
{
    public class CreateLeaveRequestRequest
    {
        [Required]
        public Guid LeaveTypeId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsHourlyLeave { get; set; }

        public TimeSpan? StartTime { get; set; }
    }
}
