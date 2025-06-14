using Azure;
using KmtBackend.API.Common;
using KmtBackend.API.DTOs.Auth;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.Models.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;

namespace KmtBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthManager _authService;

        public AuthController(IAuthManager authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                return Ok(new ResponseWrapper<LoginResponse>
                {
                    Data = response,
                    Message = "Logged In Successfully!",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new ResponseWrapper<LoginResponse>
                {
                    Message = "Invalid Credentials",
                    Success = false
                });
            }
        }
    }
}
