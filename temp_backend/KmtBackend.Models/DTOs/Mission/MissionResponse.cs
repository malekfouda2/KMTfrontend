namespace KmtBackend.Models.DTOs.Mission
{
    public class MissionResponse
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = null!;
        public DateTime MissionDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string Location { get; set; } = null!;
        public string? VehicleNumber { get; set; }
        public string? TransportationMethod { get; set; }
        public string? Comments { get; set; }
        public Guid CreatedById { get; set; }
        public string CreatedByUsername { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public IEnumerable<MissionAssignmentResponse> Assignments { get; set; } = [];
    }
}
