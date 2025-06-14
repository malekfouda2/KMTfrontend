using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Mission
{
    namespace KmtBackend.Models.DTOs.Mission
    {
        public class CreateMissionRequest
        {
            [Required]
            [MaxLength(500)]
            public string Description { get; set; } = null!;

            [Required]
            [MaxLength(500)]
            public string DescriptionAr { get; set; } = null!;

            [Required]
            public DateTime MissionDate { get; set; }

            [Required]
            public TimeSpan StartTime { get; set; }

            public TimeSpan? EndTime { get; set; }

            [Required]
            [MaxLength(200)]
            public string Location { get; set; } = null!;
        }
    }
}
