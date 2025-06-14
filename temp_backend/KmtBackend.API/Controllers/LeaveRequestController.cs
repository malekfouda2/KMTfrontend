using KmtBackend.API.Attributes;
using KmtBackend.API.Common;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Leave;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveRequestController : ControllerBase
    {
        private readonly ILeaveRequestManager _leaveRequestManager;
        
        public LeaveRequestController(ILeaveRequestManager leaveRequestManager)
        {
            _leaveRequestManager = leaveRequestManager;
        }
        
        [HttpGet]
        //[RequirePermission(Permissions.ViewAllLeaveRequests)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationQuery pagination)
        {
            var result = await _leaveRequestManager.GetAllLeaveRequestsPaginatedAsync(pagination);
            
            return Ok(new ResponseWrapper<IEnumerable<LeaveRequestResponse>>
            {
                Data = result.Items,
                Message = "Retrieved leave requests successfully",
                Success = true,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords
            });
        }
        
        [HttpGet("{id}")]
        //[RequirePermission(Permissions.ViewLeaveRequests)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var leaveRequest = await _leaveRequestManager.GetLeaveRequestByIdAsync(id);
            
            if (leaveRequest == null)
            {
                return NotFound(new ResponseWrapper<LeaveRequestResponse>
                {
                    Message = "Leave request not found",
                    Success = false
                });
            }
            
            return Ok(new ResponseWrapper<LeaveRequestResponse>
            {
                Data = leaveRequest,
                Message = "Retrieved leave request successfully",
                Success = true
            });
        }
        
        [HttpGet("User/{userId}")]
        //[RequirePermission(Permissions.ViewLeaveRequests)]
        public async Task<IActionResult> GetUserRequests(Guid userId, [FromQuery] PaginationQuery pagination)
        {   
            var result = await _leaveRequestManager.GetUserLeaveRequestsPaginatedAsync(userId, pagination);
            
            return Ok(new ResponseWrapper<IEnumerable<LeaveRequestResponse>>
            {
                Data = result.Items,
                Message = "Retrieved leave requests successfully",
                Success = true,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords
            });
        }
        
        [HttpGet("Department/{departmentId}")]
        //[RequirePermission(Permissions.ViewDepartmentLeaveRequests)]
        public async Task<IActionResult> GetDepartmentRequests(Guid departmentId, [FromQuery] PaginationQuery pagination)
        {
            var result = await _leaveRequestManager.GetDepartmentLeaveRequestsPaginatedAsync(departmentId, pagination);
            
            return Ok(new ResponseWrapper<IEnumerable<LeaveRequestResponse>>
            {
                Data = result.Items,
                Message = "Retrieved department leave requests successfully",
                Success = true,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords
            });
        }
        
        [HttpPost]
        //[RequirePermission(Permissions.RequestLeave)]
        public async Task<IActionResult> Create([FromBody] CreateLeaveRequestRequest request)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var leaveRequest = await _leaveRequestManager.CreateLeaveRequestAsync(userId, request);
                
                return CreatedAtAction(nameof(GetById), new { id = leaveRequest.Id }, 
                    new ResponseWrapper<LeaveRequestResponse>
                    {
                        Data = leaveRequest,
                        Message = "Leave request created successfully",
                        Success = true
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<LeaveRequestResponse>
                {
                    Message = "Failed to create leave request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }
        
        [HttpPut("{id}/Approve")]
        //[RequirePermission(Permissions.ApproveLeaveRequests)]
        public async Task<IActionResult> Approve(Guid id)
        {
            try
            {
                var leaveRequest = await _leaveRequestManager.ApproveLeaveRequestAsync(id);
                
                return Ok(new ResponseWrapper<LeaveRequestResponse>
                {
                    Data = leaveRequest,
                    Message = "Leave request approved successfully",
                    Success = true
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ResponseWrapper<LeaveRequestResponse>
                {
                    Message = "Leave request not found",
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<LeaveRequestResponse>
                {
                    Message = "Failed to approve leave request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }
        
        [HttpPut("{id}/Reject")]
        //[RequirePermission(Permissions.ApproveLeaveRequests)]
        public async Task<IActionResult> Reject(Guid id, [FromBody] RejectLeaveRequestRequest request)
        {
            try
            {
                var leaveRequest = await _leaveRequestManager.RejectLeaveRequestAsync(id, request);
                
                return Ok(new ResponseWrapper<LeaveRequestResponse>
                {
                    Data = leaveRequest,
                    Message = "Leave request rejected successfully",
                    Success = true
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ResponseWrapper<LeaveRequestResponse>
                {
                    Message = "Leave request not found",
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<LeaveRequestResponse>
                {
                    Message = "Failed to reject leave request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }
        
        [HttpPut("{id}/Cancel")]
        //[RequirePermission(Permissions.RequestLeave)]
        public async Task<IActionResult> Cancel(Guid id)
        {
            try
            {
                var result = await _leaveRequestManager.CancelLeaveRequestAsync(id);
                
                return Ok(new ResponseWrapper<bool>
                {
                    Data = result,
                    Message = "Leave request canceled successfully",
                    Success = true
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ResponseWrapper<bool>
                {
                    Message = "Leave request not found",
                    Success = false
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<bool>
                {
                    Message = "Failed to cancel leave request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }
    }
}