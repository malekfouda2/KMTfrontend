using KmtBackend.API.Attributes;
using KmtBackend.API.Common;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Role;
using KmtBackend.Models.DTOs.User;
using Microsoft.AspNetCore.Mvc;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserManager _userService;

        public UserController(IUserManager userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [RequirePermission(Permissions.ViewUsers)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationQuery pagination)
        {
            var users = await _userService.GetAllUsersPaginatedAsync(pagination);
            return Ok(new ResponseWrapper<IEnumerable<UserResponse>>
            {
                Data = users.Items,
                Message = "Retrieved Roles Successfully.",
                Success = true,
                PageNumber = users.PageNumber,
                PageSize = users.PageSize,
                TotalRecords = users.TotalRecords
            });
        }

        [HttpGet("{id}")]
        [RequirePermission(Permissions.ViewUsers)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
                return NotFound(new ResponseWrapper<UserResponse>
                {
                    Message = "User Not Found",
                    Success = false
                });

            return Ok(new ResponseWrapper<UserResponse>
            {
                Data = user,
                Message = "Retrieved User Successfully.",
                Success = true
            });
        }

        [HttpPost]
        [RequirePermission(Permissions.CreateUsers)]
        public async Task<IActionResult> Create(CreateUserRequest request)
        {
            try
            {
                var user = await _userService.CreateUserAsync(request);

                return CreatedAtAction(null, new ResponseWrapper<UserResponse>
                {
                    Data = user,
                    Message = "User Created Successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<UserResponse>
                {
                    Message = "Bad Request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpPut("{id}")]
        [RequirePermission(Permissions.UpdateUsers)]
        public async Task<IActionResult> Update(Guid id, UpdateUserRequest request)
        {
            try
            {
                var user = await _userService.UpdateUserAsync(id, request);

                return Ok(new ResponseWrapper<UserResponse>
                {
                    Data = user,
                    Message = "Updated User Successfully.",
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

        [HttpDelete("{id}")]
        [RequirePermission(Permissions.DeleteUsers)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (!result)
                return NotFound(new ResponseWrapper<UserResponse>
                {
                    Message = "User Not Found",
                    Success = false
                });

            return NoContent();
        }
    }
}
