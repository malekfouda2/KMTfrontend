using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Mission;
using Mapster;

namespace KmtBackend.API.Mapping
{
    public class MissionMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Mission, MissionResponse>()
                .Map(dest => dest.CreatedByUsername, src => src.CreatedBy.Username);
                //.Map(dest => dest.Assignments, src => src.Assignments);

            config.NewConfig<MissionAssignment, MissionAssignmentResponse>()
                .Map(dest => dest.Username, src => src.User.Username)
                .Map(dest => dest.AssignedByUsername, src => src.AssignedBy.Username);
        }
    }
}
