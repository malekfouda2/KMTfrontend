using KmtBackend.API.Common;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Leave;
using Microsoft.AspNetCore.Mvc;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveTypeController : ControllerBase
    {
        private readonly ILeaveTypeManager _leaveTypeManager;

        public LeaveTypeController(ILeaveTypeManager leaveTypeManager)
        {
            _leaveTypeManager = leaveTypeManager;
        }

        [HttpGet]
        //[RequirePermission(Permissions.ViewLeaveTypes)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationQuery pagination)
        {
            var result = await _leaveTypeManager.GetAllLeaveTypesPaginatedAsync(pagination);

            return Ok(new ResponseWrapper<IEnumerable<LeaveTypeResponse>>
            {
                Data = result.Items,
                Message = "Retrieved leave types successfully",
                Success = true,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords
            });
        }

        [HttpGet("{id}")]
        //[RequirePermission(Permissions.ViewLeaveTypes)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var leaveType = await _leaveTypeManager.GetLeaveTypeByIdAsync(id);

            if (leaveType == null)
            {
                return NotFound(new ResponseWrapper<LeaveTypeResponse>
                {
                    Message = "Leave type not found",
                    Success = false
                });
            }

            return Ok(new ResponseWrapper<LeaveTypeResponse>
            {
                Data = leaveType,
                Message = "Retrieved leave type successfully",
                Success = true
            });
        }
    }
}
