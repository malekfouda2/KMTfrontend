namespace KmtBackend.Models.DTOs.Leave
{
    public class LeaveRequestResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; } = null!;
        public Guid LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; } = null!;
        public string LeaveTypeNameAr { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Days { get; set; }
        public string Status { get; set; } = null!;
        public Guid? ProcessedById { get; set; }
        public string? ProcessedByUsername { get; set; }
        public DateTime? ProcessedDate { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsHourlyLeave { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
    }
}
