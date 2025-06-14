using KmtBackend.API.Attributes;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.Models.DTOs.Role;
using KmtBackend.API.Common;
using Microsoft.AspNetCore.Mvc;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Department;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleManager _roleManager;

        public RoleController(IRoleManager roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet]
        [RequirePermission(Permissions.ViewRoles)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationQuery pagination)
        {
            var roles = await _roleManager.GetAllRolesPaginatedAsync(pagination);
            return Ok(new ResponseWrapper<IEnumerable<RoleResponse>>
            {
                Data = roles.Items,
                Message = "Retrieved Roles Successfully.",
                Success = true,
                PageNumber = roles.PageNumber,
                PageSize = roles.PageSize,
                TotalRecords = roles.TotalRecords
            });
        }

        [HttpGet("{id:guid}")]
        [RequirePermission(Permissions.ViewRoles)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var role = await _roleManager.GetRoleByIdAsync(id);

            if (role == null)
                return NotFound(new ResponseWrapper<RoleResponse>
                {
                    Message = "Role Not Found",
                    Success = false
                });

            return Ok(new ResponseWrapper<RoleResponse>
            {
                Data = role,
                Message = "Retrieved Role Successfully.",
                Success = true
            });
        }

        [HttpPost]
        [RequirePermission(Permissions.CreateRoles)]
        public async Task<IActionResult> Create(CreateRoleRequest request)
        {
            try
            {
                var role = await _roleManager.CreateRoleAsync(request);
                return CreatedAtAction(null, new ResponseWrapper<RoleResponse>
                {
                    Data = role,
                    Message = "Role Created Successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<RoleResponse>
                {
                    Message = "Bad Request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpPut("{id:guid}")]
        [RequirePermission(Permissions.UpdateRoles)]
        public async Task<IActionResult> Update(Guid id, UpdateRoleRequest request)
        {
            try
            {
                var role = await _roleManager.UpdateRoleAsync(id, request);
                return Ok(new ResponseWrapper<RoleResponse>
                {
                    Data = role,
                    Message = "Updated Role Successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("not found"))
                    return NotFound(new ResponseWrapper<RoleResponse>
                    {
                        Message = "Role Not Found",
                        Success = false
                    });

                return BadRequest(new ResponseWrapper<RoleResponse>
                {
                    Message = "Bad Request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpDelete("{id:guid}")]
        [RequirePermission(Permissions.DeleteRoles)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _roleManager.DeleteRoleAsync(id);

            if (!result)
                return NotFound(new ResponseWrapper<RoleResponse>
                {
                    Message = "Role Not Found",
                    Success = false
                });

            return NoContent();
        }

        //[HttpPost("{id:guid}/permissions")]
        //[RequirePermission(Permissions.AssignPermissions)]
        //public async Task<IActionResult> AssignPermissions(Guid id, AssignPermissionsRequest request)
        //{
        //    try
        //    {
        //        var role = await _roleManager.AssignPermissionsAsync(id, request);
        //        return Ok(new ResponseWrapper<RoleResponse>
        //        {
        //            Data = role,
        //            Message = "Assigned Permissions Successfully.",
        //            Success = true
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        if (ex.Message.Contains("not found"))
        //            return NotFound(new ResponseWrapper<RoleResponse>
        //            {
        //                Message = "Role Not Found",
        //                Success = false
        //            });

        //        return BadRequest(new ResponseWrapper<RoleResponse>
        //        {
        //            Message = "Bad Request",
        //            Success = false,
        //            Errors = [ex.Message]
        //        });
        //    }
        //}
    }
}
