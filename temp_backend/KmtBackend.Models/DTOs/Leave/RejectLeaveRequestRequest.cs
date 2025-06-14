using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Leave
{
    public class RejectLeaveRequestRequest
    {
        [Required]
        [MaxLength(500)]
        public string RejectionReason { get; set; } = null!;
    }
}
