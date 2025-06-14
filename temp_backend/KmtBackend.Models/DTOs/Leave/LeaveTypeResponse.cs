namespace KmtBackend.Models.DTOs.Leave
{
    public class LeaveTypeResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string NameAr { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string DescriptionAr { get; set; } = null!;
        public bool IsSeniorityBased { get; set; }
        public bool AllowCarryOver { get; set; }
    }
}
