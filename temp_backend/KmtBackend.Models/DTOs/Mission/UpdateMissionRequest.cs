using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Mission
{
    public class UpdateMissionRequest
    {
        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? DescriptionAr { get; set; }

        public DateTime? MissionDate { get; set; }

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }
    }
}
