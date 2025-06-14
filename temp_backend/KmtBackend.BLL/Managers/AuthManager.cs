using KmtBackend.API.DTOs.Auth;
using KmtBackend.DAL.Repositories.Interfaces;
using MapsterMapper;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.Infrastructure.TokenGenerator;
using Microsoft.AspNetCore.Identity;
using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Auth;
using KmtBackend.Infrastructure.Helpers;

namespace KmtBackend.BLL.Managers
{
    public class AuthManager : IAuthManager
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IMapper _mapper;
        private readonly JwtSettings _jwtSettings;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthManager(
            IUserRepository userRepository,
            IJwtTokenGenerator jwtTokenGenerator,
            IMapper mapper,
            IOptions<JwtSettings> jwtSettings)
        {
            _userRepository = userRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
            _mapper = mapper;
            _jwtSettings = jwtSettings.Value;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            User? user = null;

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                user = await _userRepository.GetByEmailAsync(request.Email);
            }
            else if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                string normalizedPhoneNumber = PhoneNumberHelper.Normalize(request.PhoneNumber);
                user = await _userRepository.GetByPhoneNumberAsync(normalizedPhoneNumber);
            }
            if (user == null)
            {
                throw new Exception("Invalid credentials");
            }

            var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                throw new Exception("Invalid credentials");
            }

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new LoginResponse
            {
                Token = token,
                User = _mapper.Map<UserDto>(user)
            };
        }

        public Task<bool> ValidateTokenAsync(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out _);

                return Task.FromResult(true);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }
    }
}
