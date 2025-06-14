using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Mission
{
    public class AssignUsersToMissionRequest
    {
        [Required]
        public IEnumerable<Guid> UserIds { get; set; } = [];
    }
}
