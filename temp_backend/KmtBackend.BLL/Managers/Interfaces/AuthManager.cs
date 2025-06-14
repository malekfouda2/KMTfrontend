using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Mission;
using KmtBackend.Models.DTOs.Mission.KmtBackend.Models.DTOs.Mission;
using System;
using System.Threading.Tasks;

namespace KmtBackend.BLL.Managers.Interfaces
{
    public interface IMissionManager
    {
        Task<MissionResponse> CreateMissionAsync(Guid creatorId, CreateMissionRequest request);
        Task<MissionResponse?> GetMissionByIdAsync(Guid id);
        Task<PaginatedResult<MissionResponse>> GetAllMissionsPaginatedAsync(PaginationQuery pagination);
        Task<PaginatedResult<MissionResponse>> GetMissionsByCreatorPaginatedAsync(Guid creatorId, PaginationQuery pagination);
        Task<PaginatedResult<MissionResponse>> GetMissionsByUserAssignmentPaginatedAsync(Guid userId, PaginationQuery pagination);
        Task<MissionResponse> UpdateMissionAsync(Guid id, UpdateMissionRequest request);
        Task<MissionResponse> UpdateMissionTransportationAsync(Guid id, UpdateMissionTransportationRequest request);
        Task<bool> DeleteMissionAsync(Guid id);
        Task<IEnumerable<MissionAssignmentResponse>> AssignUsersToMissionAsync(Guid missionId, Guid assignerId, AssignUsersToMissionRequest request);
        Task<bool> RemoveUserFromMissionAsync(Guid missionId, Guid userId);
    }
}