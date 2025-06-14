using KmtBackend.API.Attributes;
using KmtBackend.API.Common;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Mission;
using KmtBackend.Models.DTOs.Mission.KmtBackend.Models.DTOs.Mission;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MissionController : ControllerBase
    {
        private readonly IMissionManager _missionManager;

        public MissionController(IMissionManager missionManager)
        {
            _missionManager = missionManager;
        }

        [HttpGet]
        [RequirePermission(Permissions.ViewMissions)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationQuery pagination)
        {
            var missions = await _missionManager.GetAllMissionsPaginatedAsync(pagination);

            return Ok(new ResponseWrapper<IEnumerable<MissionResponse>>
            {
                Data = missions.Items,
                Message = "Missions retrieved successfully",
                Success = true,
                PageNumber = missions.PageNumber,
                PageSize = missions.PageSize,
                TotalRecords = missions.TotalRecords
            });
        }

        [HttpGet("{id}")]
        [RequirePermission(Permissions.ViewMissions)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var mission = await _missionManager.GetMissionByIdAsync(id);

            if (mission == null)
            {
                return NotFound(new ResponseWrapper<MissionResponse>
                {
                    Message = "Mission not found",
                    Success = false
                });
            }

            return Ok(new ResponseWrapper<MissionResponse>
            {
                Data = mission,
                Message = "Mission retrieved successfully",
                Success = true
            });
        }

        [HttpGet("created-by-me")]
        [RequirePermission(Permissions.ViewMissions)]
        public async Task<IActionResult> GetCreatedByMe([FromQuery] PaginationQuery pagination)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var missions = await _missionManager.GetMissionsByCreatorPaginatedAsync(userId, pagination);

            return Ok(new ResponseWrapper<IEnumerable<MissionResponse>>
            {
                Data = missions.Items,
                Message = "Missions retrieved successfully",
                Success = true,
                PageNumber = missions.PageNumber,
                PageSize = missions.PageSize,
                TotalRecords = missions.TotalRecords
            });
        }

        [HttpGet("assigned-to-me")]
        [RequirePermission(Permissions.ViewMissions)]
        public async Task<IActionResult> GetAssignedToMe([FromQuery] PaginationQuery pagination)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var missions = await _missionManager.GetMissionsByUserAssignmentPaginatedAsync(userId, pagination);

            return Ok(new ResponseWrapper<IEnumerable<MissionResponse>>
            {
                Data = missions.Items,
                Message = "Missions retrieved successfully",
                Success = true,
                PageNumber = missions.PageNumber,
                PageSize = missions.PageSize,
                TotalRecords = missions.TotalRecords
            });
        }

        [HttpPost]
        [RequirePermission(Permissions.CreateMissions)]
        public async Task<IActionResult> Create(CreateMissionRequest request)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var mission = await _missionManager.CreateMissionAsync(userId, request);

                return CreatedAtAction(nameof(GetById), new { id = mission.Id }, new ResponseWrapper<MissionResponse>
                {
                    Data = mission,
                    Message = "Mission created successfully",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<MissionResponse>
                {
                    Message = "Failed to create mission",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpPut("{id}")]
        [RequirePermission(Permissions.UpdateMissions)]
        public async Task<IActionResult> Update(Guid id, UpdateMissionRequest request)
        {
            try
            {
                var mission = await _missionManager.UpdateMissionAsync(id, request);

                return Ok(new ResponseWrapper<MissionResponse>
                {
                    Data = mission,
                    Message = "Mission updated successfully",
                    Success = true
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ResponseWrapper<MissionResponse>
                {
                    Message = "Mission not found",
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<MissionResponse>
                {
                    Message = "Failed to update mission",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpPut("{id}/transportation")]
        [RequirePermission(Permissions.UpdateMissionTransportation)]
        public async Task<IActionResult> UpdateTransportation(Guid id, UpdateMissionTransportationRequest request)
        {
            try
            {
                var mission = await _missionManager.UpdateMissionTransportationAsync(id, request);

                return Ok(new ResponseWrapper<MissionResponse>
                {
                    Data = mission,
                    Message = "Mission transportation details updated successfully",
                    Success = true
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ResponseWrapper<MissionResponse>
                {
                    Message = "Mission not found",
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<MissionResponse>
                {
                    Message = "Failed to update mission transportation details",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpDelete("{id}")]
        [RequirePermission(Permissions.DeleteMissions)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _missionManager.DeleteMissionAsync(id);

            if (!result)
            {
                return NotFound(new ResponseWrapper<object>
                {
                    Message = "Mission not found",
                    Success = false
                });
            }

            return NoContent();
        }

        [HttpPost("{id}/assignments")]
        [RequirePermission(Permissions.AssignToMissions)]
        public async Task<IActionResult> AssignUser(Guid id, AssignUsersToMissionRequest request)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var assignment = await _missionManager.AssignUsersToMissionAsync(id, userId, request);

                return Ok(new ResponseWrapper<IEnumerable<MissionAssignmentResponse>>
                {
                    Data = assignment,
                    Message = "User assigned to mission successfully",
                    Success = true
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ResponseWrapper<MissionAssignmentResponse>
                {
                    Message = ex.Message,
                    Success = false
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ResponseWrapper<MissionAssignmentResponse>
                {
                    Message = ex.Message,
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<MissionAssignmentResponse>
                {
                    Message = "Failed to assign user to mission",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpDelete("{id}/assignments/{userId}")]
        [RequirePermission(Permissions.AssignToMissions)]
        public async Task<IActionResult> RemoveUser(Guid id, Guid userId)
        {
            var result = await _missionManager.RemoveUserFromMissionAsync(id, userId);

            if (!result)
            {
                return NotFound(new ResponseWrapper<object>
                {
                    Message = "Assignment not found",
                    Success = false
                });
            }

            return NoContent();
        }
    }
}