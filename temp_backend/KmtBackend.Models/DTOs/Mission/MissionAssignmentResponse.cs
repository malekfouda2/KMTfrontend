namespace KmtBackend.Models.DTOs.Mission
{
    public class MissionAssignmentResponse
    {
        public Guid Id { get; set; }
        public Guid MissionId { get; set; }
        public IEnumerable<Guid> UserId { get; set; } = [];
        public string Username { get; set; } = null!;
        public Guid AssignedById { get; set; }
        public string AssignedByUsername { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
