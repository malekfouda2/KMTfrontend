using KmtBackend.API.Common;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Leave;
using Microsoft.AspNetCore.Mvc;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveBalanceController : ControllerBase
    {
        private readonly ILeaveBalanceManager _leaveBalanceManager;
        
        public LeaveBalanceController(ILeaveBalanceManager leaveBalanceManager)
        {
            _leaveBalanceManager = leaveBalanceManager;
        }
        
        [HttpGet("User/{userId}")]
        //[RequirePermission(Permissions.ViewLeaveBalances)]
        public async Task<IActionResult> GetUserBalances(Guid userId, [FromQuery] int? year)
        {
            var result = await _leaveBalanceManager.GetUserLeaveBalancesAsync(userId, year);
            
            return Ok(new ResponseWrapper<IEnumerable<LeaveBalanceResponse>>
            {
                Data = result,
                Message = "Retrieved leave balances successfully",
                Success = true
            });
        }
        
        [HttpGet("{id}")]
        //[RequirePermission(Permissions.ViewLeaveBalances)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var leaveBalance = await _leaveBalanceManager.GetLeaveBalanceByIdAsync(id);
            
            if (leaveBalance == null)
            {
                return NotFound(new ResponseWrapper<LeaveBalanceResponse>
                {
                    Message = "Leave balance not found",
                    Success = false
                });
            }
            
            return Ok(new ResponseWrapper<LeaveBalanceResponse>
            {
                Data = leaveBalance,
                Message = "Retrieved leave balance successfully",
                Success = true
            });
        }
        
        [HttpPut("{id}")]
        //[RequirePermission(Permissions.ManageLeaveBalances)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLeaveBalanceRequest request)
        {
            try
            {
                var updatedBalance = await _leaveBalanceManager.UpdateLeaveBalanceAsync(id, request);
                
                return Ok(new ResponseWrapper<LeaveBalanceResponse>
                {
                    Data = updatedBalance,
                    Message = "Updated leave balance successfully",
                    Success = true
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ResponseWrapper<LeaveBalanceResponse>
                {
                    Message = "Leave balance not found",
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<LeaveBalanceResponse>
                {
                    Message = "Failed to update leave balance",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }
        
        [HttpPost("Reset")]
        //[RequirePermission(Permissions.ResetLeaveBalances)]
        public async Task<IActionResult> ResetAllBalances([FromQuery] int? year = null)
        {
            // If no year provided, use current year
            int targetYear = year ?? DateTime.Now.Year;
            
            var count = await _leaveBalanceManager.ResetAllUserBalancesAsync(targetYear);
            
            return Ok(new ResponseWrapper<int>
            {
                Data = count,
                Message = $"Reset {count} leave balances for year {targetYear}",
                Success = true
            });
        }
    }
}