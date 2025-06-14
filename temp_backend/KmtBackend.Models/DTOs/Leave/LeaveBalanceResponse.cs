namespace KmtBackend.Models.DTOs.Leave
{
    public class LeaveBalanceResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; } = null!;
        public Guid LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; } = null!;
        public string LeaveTypeNameAr { get; set; } = null!;
        public int Year { get; set; }
        public int TotalDays { get; set; }
        public int UsedDays { get; set; }
        public int RemainingDays { get; set; }
    }
}
