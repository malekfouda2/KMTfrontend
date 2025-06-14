using KmtBackend.API.Attributes;
using KmtBackend.API.Common;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.Models.DTOs.Role;
using KmtBackend.Models.DTOs.User;
using Microsoft.AspNetCore.Mvc;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/User/{userId:guid}/Roles")]
    public class UserRoleController : ControllerBase
    {
        private readonly IUserRoleManager _userRoleManager;

        public UserRoleController(IUserRoleManager userRoleManager)
        {
            _userRoleManager = userRoleManager;
        }

        [HttpGet]
        [RequirePermission(Permissions.ViewRoles)]
        public async Task<IActionResult> GetUserRoles(Guid userId)
        {
            var roles = await _userRoleManager.GetUserRolesAsync(userId);

            return Ok(new ResponseWrapper<IEnumerable<RoleResponse>>
            {
                Data = roles,
                Message = "Retrieved Roles Successfully.",
                Success = true
            });
        }

        [HttpPost]
        [RequirePermission(Permissions.AssignRoles)]
        public async Task<IActionResult> AssignRoles(Guid userId, AssignRolesRequest request)
        {
            try
            {
                var user = await _userRoleManager.AssignRolesToUserAsync(userId, request);

                return Ok(new ResponseWrapper<UserResponse>
                {
                    Data = user,
                    Message = "Assigned Roles Successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("not found"))
                    return NotFound(new ResponseWrapper<UserResponse>
                    {
                        Message = "User Not Found",
                        Success = false
                    });

                return BadRequest(new ResponseWrapper<UserResponse>
                {
                    Message = "Bad Request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }
    }
}