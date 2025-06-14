using KmtBackend.API.Attributes;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.Models.DTOs.Permission;
using KmtBackend.API.Common;
using Microsoft.AspNetCore.Mvc;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Department;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionManager _permissionManager;

        public PermissionController(IPermissionManager permissionManager)
        {
            _permissionManager = permissionManager;
        }

        [HttpGet]
        [RequirePermission(Permissions.ViewPermissions)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationQuery pagination)
        {
            var permissions = await _permissionManager.GetAllPermissionsPaginatedAsync(pagination);
            return Ok(new ResponseWrapper<IEnumerable<PermissionResponse>>
            {
                Data = permissions.Items,
                Message = "Retrieved Permissions Successfully.",
                Success = true,
                PageNumber = permissions.PageNumber,
                PageSize = permissions.PageSize,
                TotalRecords = permissions.TotalRecords
            });
        }

        [HttpGet("{id:guid}")]
        [RequirePermission(Permissions.ViewPermissions)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var permission = await _permissionManager.GetPermissionByIdAsync(id);

            if (permission == null)
                return NotFound(new ResponseWrapper<PermissionResponse>
                {
                    Message = "Permission Not Found",
                    Success = false
                });

            return Ok(new ResponseWrapper<PermissionResponse>
            {
                Data = permission,
                Message = "Retrieved Permission Successfully.",
                Success = true
            });
        }
    }
}
