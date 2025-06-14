using KmtBackend.API.Attributes;
using KmtBackend.API.Common;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Role;
using KmtBackend.Models.DTOs.Title;
using Microsoft.AspNetCore.Mvc;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TitleController : ControllerBase
    {
        private readonly ITitleManager _titleService;

        public TitleController(ITitleManager titleService)
        {
            _titleService = titleService;
        }

        [HttpGet]
        [RequirePermission(Permissions.ViewTitles)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationQuery pagination)
        {
            var roles = await _titleService.GetAllTitlesPaginatedAsync(pagination);
            return Ok(new ResponseWrapper<IEnumerable<TitleResponse>>
            {
                Data = roles.Items,
                Message = "Retrieved Titles Successfully.",
                Success = true,
                PageNumber = roles.PageNumber,
                PageSize = roles.PageSize,
                TotalRecords = roles.TotalRecords
            });
        }

        [HttpGet("{id}")]
        [RequirePermission(Permissions.ViewTitles)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var title = await _titleService.GetTitleByIdAsync(id);

            if (title == null)
                return NotFound(new ResponseWrapper<TitleResponse>
                {
                    Message = "Title Not Found",
                    Success = false
                });

            return Ok(new ResponseWrapper<TitleResponse>
            {
                Data = title,
                Message = "Retrieved Title Successfully.",
                Success = true
            });
        }

        [HttpPost]
        [RequirePermission(Permissions.CreateTitles)]
        public async Task<IActionResult> Create(CreateTitleRequest request)
        {
            try
            {
                var title = await _titleService.CreateTitleAsync(request);
                return CreatedAtAction(null, new ResponseWrapper<TitleResponse>
                {
                    Data = title,
                    Message = "Title Created Successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<TitleResponse>
                {
                    Message = "Bad Request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpPut("{id}")]
        [RequirePermission(Permissions.UpdateTitles)]
        public async Task<IActionResult> Update(Guid id, UpdateTitleRequest request)
        {
            try
            {
                var title = await _titleService.UpdateTitleAsync(id, request);
                return Ok(new ResponseWrapper<TitleResponse>
                {
                    Data = title,
                    Message = "Title Updated Successfully.",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("not found"))
                    return NotFound(new ResponseWrapper<TitleResponse>
                    {
                        Message = "Title Not Found",
                        Success = false
                    });

                return BadRequest(new ResponseWrapper<TitleResponse>
                {
                    Message = "Bad Request",
                    Success = false,
                    Errors = [ex.Message]
                });
            }
        }

        [HttpDelete("{id}")]
        [RequirePermission(Permissions.DeleteTitles)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _titleService.DeleteTitleAsync(id);

            if (!result)
                return NotFound(new ResponseWrapper<TitleResponse>
                {
                    Message = "Title Not Found",
                    Success = false
                });

            return NoContent();
        }
    }
}
