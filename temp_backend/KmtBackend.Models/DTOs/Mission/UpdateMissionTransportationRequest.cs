using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Mission
{
    public class UpdateMissionTransportationRequest
    {
        [MaxLength(50)]
        public string? VehicleNumber { get; set; }

        [MaxLength(100)]
        public string? TransportationMethod { get; set; }

        [MaxLength(500)]
        public string? Comments { get; set; }
    }
}
