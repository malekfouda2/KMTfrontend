using KmtBackend.DAL.Entities;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface IMissionAssignmentRepository
    {
        Task<MissionAssignment?> GetByMissionAndUserAsync(Guid missionId, Guid userId);
        Task<IEnumerable<MissionAssignment>> GetByMissionIdAsync(Guid missionId);
        Task<IEnumerable<MissionAssignment>> GetByUserIdAsync(Guid userId);
        Task<MissionAssignment> CreateAsync(MissionAssignment assignment);
        Task<bool> DeleteAsync(Guid id);
    }
}