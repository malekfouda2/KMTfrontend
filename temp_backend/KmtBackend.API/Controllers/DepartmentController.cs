using KmtBackend.API.Attributes;
using KmtBackend.API.Common;
using KmtBackend.API.DTOs.Department;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Department;
using Microsoft.AspNetCore.Mvc;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentManager _departmentService;

        public DepartmentController(IDepartmentManager departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        [RequirePermission(Permissions.ViewDepartments)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationQuery pagination)
        {
            var departments = await _departmentService.GetAllDepartmentsAsync(pagination);
            return Ok(new ResponseWrapper<IEnumerable<DepartmentResponse>>
            {
                Data = departments.Items,
                Message = "Retrieved Departments Successfully.",
                Success = true,
                PageNumber = departments.PageNumber,
                PageSize = departments.PageSize,
                TotalRecords = departments.TotalRecords
            });
        }

        [HttpGet("{id}")]
        [RequirePermission(Permissions.ViewDepartments)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var department = await _departmentService.GetDepartmentByIdAsync(id);
            
            if (department == null)
                return NotFound(new ResponseWrapper<DepartmentResponse>
                {
                    Message = "Department Not Found",
                    Success = false
                });

            return Ok(new ResponseWrapper<DepartmentResponse>
            {
                Data = department,
                Message = "Retrieved Department Successfully.",
                Success = true
            });
        }

        [HttpPost]
        [RequirePermission(Permissions.CreateDepartments)]
        public async Task<IActionResult> Create(CreateDepartmentRequest request)
        {
            try
            {
                var department = await _departmentService.CreateDepartmentAsync(request);
                return CreatedAtAction(null, new ResponseWrapper<DepartmentResponse>
                {
                    Data = department,
                    Message = "Department Created Succesfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<DepartmentResponse>
                {
                    Message = "Bad Request",
                    Success = false,
                    Errors = []
                });
            }
        }

        [HttpPut("{id}")]
        [RequirePermission(Permissions.UpdateDepartments)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDepartmentRequest request)
        {
            try
            {
                var department = await _departmentService.UpdateDepartmentAsync(id, request);

                return Ok(new ResponseWrapper<DepartmentResponse>
                {
                    Data = department,
                    Message = "Department Updated Successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("not found"))
                    return NotFound(new ResponseWrapper<DepartmentResponse>
                    {
                        Message = "Department Not Found",
                        Success = false
                    });

                return BadRequest(new ResponseWrapper<DepartmentResponse>
                {
                    Message = "Bad Request",
                    Success = false,
                    Errors = []
                });
            }
        }

        [HttpDelete("{id}")]
        [RequirePermission(Permissions.DeleteDepartments)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _departmentService.DeleteDepartmentAsync(id);
            
            if (!result)
                return NotFound(new ResponseWrapper<DepartmentResponse>
                {
                    Message = "Department Not Found",
                    Success = false
                });

            return NoContent();
        }
    }
}

