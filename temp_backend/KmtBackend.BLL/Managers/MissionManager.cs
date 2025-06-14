using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Mission;
using KmtBackend.Models.DTOs.Mission.KmtBackend.Models.DTOs.Mission;
using MapsterMapper;

namespace KmtBackend.BLL.Managers
{
    public class MissionManager : IMissionManager
    {
        private readonly IMissionRepository _missionRepository;
        private readonly IMissionAssignmentRepository _assignmentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public MissionManager(
            IMissionRepository missionRepository,
            IMissionAssignmentRepository assignmentRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _missionRepository = missionRepository;
            _assignmentRepository = assignmentRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<MissionResponse> CreateMissionAsync(Guid creatorId, CreateMissionRequest request)
        {
            // Verify the creator exists
            _ = await _userRepository.GetByIdAsync(creatorId) ?? throw new KeyNotFoundException("Creator not found");
            var mission = new Mission
            {
                Id = Guid.NewGuid(),
                Description = request.Description,
                MissionDate = request.MissionDate,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Location = request.Location,
                CreatedById = creatorId,
                CreatedAt = DateTime.UtcNow
            };

            var createdMission = await _missionRepository.CreateAsync(mission);
            
            return _mapper.Map<MissionResponse>(createdMission);
        }

        public async Task<MissionResponse?> GetMissionByIdAsync(Guid id)
        {
            var mission = await _missionRepository.GetByIdAsync(id);
            if (mission == null) return null;

            return _mapper.Map<MissionResponse>(mission);
        }

        public async Task<PaginatedResult<MissionResponse>> GetAllMissionsPaginatedAsync(PaginationQuery pagination)
        {
            var results = await _missionRepository.GetAllPaginatedAsync(pagination);

            var responses = _mapper.Map<IEnumerable<MissionResponse>>(results.Items).ToList();

            return new PaginatedResult<MissionResponse>
            {
                Items = responses,
                PageNumber = results.PageNumber,
                PageSize = results.PageSize,
                TotalRecords = results.TotalRecords
            };
        }

        public async Task<PaginatedResult<MissionResponse>> GetMissionsByCreatorPaginatedAsync(Guid creatorId, PaginationQuery pagination)
        {
            var results = await _missionRepository.GetByCreatorIdPaginatedAsync(creatorId, pagination);

            var responses = _mapper.Map<IEnumerable<MissionResponse>>(results.Items).ToList();

            return new PaginatedResult<MissionResponse>
            {
                Items = responses,
                PageNumber = results.PageNumber,
                PageSize = results.PageSize,
                TotalRecords = results.TotalRecords
            };
        }

        public async Task<PaginatedResult<MissionResponse>> GetMissionsByUserAssignmentPaginatedAsync(Guid userId, PaginationQuery pagination)
        {
            var results = await _missionRepository.GetByUserAssignmentPaginatedAsync(userId, pagination);

            var responses = _mapper.Map<IEnumerable<MissionResponse>>(results.Items).ToList();

            return new PaginatedResult<MissionResponse>
            {
                Items = responses,
                PageNumber = results.PageNumber,
                PageSize = results.PageSize,
                TotalRecords = results.TotalRecords
            };
        }

        public async Task<MissionResponse> UpdateMissionAsync(Guid id, UpdateMissionRequest request)
        {
            var mission = await _missionRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Mission not found");

            // Update fields if provided
            if (request.Description != null)
                mission.Description = request.Description;
                
            if (request.MissionDate.HasValue)
                mission.MissionDate = request.MissionDate.Value;
                
            if (request.StartTime.HasValue)
                mission.StartTime = request.StartTime.Value;
                
            if (request.EndTime.HasValue)
                mission.EndTime = request.EndTime;
                
            if (request.Location != null)
                mission.Location = request.Location;

            var updatedMission = await _missionRepository.UpdateAsync(mission);
            
            return _mapper.Map<MissionResponse>(updatedMission);
        }

        public async Task<MissionResponse> UpdateMissionTransportationAsync(Guid id, UpdateMissionTransportationRequest request)
        {
            var mission = await _missionRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Mission not found");

            // Update transportation-related fields if provided
            if (request.VehicleNumber != null)
                mission.VehicleNumber = request.VehicleNumber;
                
            if (request.TransportationMethod != null)
                mission.TransportationMethod = request.TransportationMethod;
                
            if (request.Comments != null)
                mission.Comments = request.Comments;

            var updatedMission = await _missionRepository.UpdateAsync(mission);
            
            return _mapper.Map<MissionResponse>(updatedMission);
        }

        public async Task<bool> DeleteMissionAsync(Guid id)
        {
            return await _missionRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<MissionAssignmentResponse>> AssignUsersToMissionAsync(Guid missionId, Guid assignerId, AssignUsersToMissionRequest request)
        {
            // Check if the mission exists
            _ = await _missionRepository.GetByIdAsync(missionId) ?? throw new KeyNotFoundException("Mission not found");

            // Get users by IDs
            var users = await _userRepository.GetByIdsAsync(request.UserIds);
            if (!users.Any())
            {
                throw new KeyNotFoundException("No valid users found");
            }

            // Check if assigner exists
            _ = await _userRepository.GetByIdAsync(assignerId) ?? throw new KeyNotFoundException("Assigner not found");

            // Check for existing assignments to avoid duplicates
            var existingAssignments = await _assignmentRepository.GetByMissionIdAsync(missionId);
            var existingUserIds = existingAssignments.Select(a => a.UserId);
            var newUserIds = users.Select(u => u.Id).Except(existingUserIds).ToList();

            if (newUserIds.Count == 0)
            {
                throw new InvalidOperationException("All users are already assigned to this mission");
            }

            // Create new assignments
            List<MissionAssignment> missionAssignments = [];
            foreach (var userId in newUserIds)
            {
                missionAssignments.Add(
                    new MissionAssignment
                    {
                        Id = Guid.NewGuid(),
                        MissionId = missionId,
                        UserId = userId,
                        AssignedById = assignerId,
                        CreatedAt = DateTime.UtcNow
                    });
            }

            // Save all assignments and map to responses
            List<MissionAssignmentResponse> assignmentResponses = [];
            foreach (var missionAssignment in missionAssignments)
            {
                assignmentResponses.Add(_mapper.Map<MissionAssignmentResponse>(
                    await _assignmentRepository.CreateAsync(missionAssignment)));
            }

            return assignmentResponses;
        }

        public async Task<bool> RemoveUserFromMissionAsync(Guid missionId, Guid userId)
        {
            var assignment = await _assignmentRepository.GetByMissionAndUserAsync(missionId, userId);
            if (assignment == null)
            {
                return false;
            }

            return await _assignmentRepository.DeleteAsync(assignment.Id);
        }
    }
}