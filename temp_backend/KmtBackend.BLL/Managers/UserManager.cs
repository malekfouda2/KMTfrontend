using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Infrastructure.Helpers;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.User;
using MapsterMapper;
using Microsoft.AspNetCore.Identity;

namespace KmtBackend.BLL.Managers
{
    public class UserManager : IUserManager
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly ILeaveBalanceManager _leaveBalanceManager;

        public UserManager(IUserRepository userRepository, IMapper mapper, ILeaveBalanceManager leaveBalanceManager)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _passwordHasher = new PasswordHasher<User>();
            _leaveBalanceManager = leaveBalanceManager;
        }

        public async Task<UserResponse> CreateUserAsync(CreateUserRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                if (await _userRepository.EmailExistsAsync(request.Email))
                {
                    throw new Exception("Email already exists");
                }
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                if (await _userRepository.PhoneNumberExistsAsync(PhoneNumberHelper.Normalize(request.PhoneNumber)))
                {
                    throw new Exception("Phone number already exists");
                }
            }

            if (!string.IsNullOrWhiteSpace(request.Username))
            {
                if (await _userRepository.UsernameExistsAsync(request.Username))
                {
                    throw new Exception("Username already exists");
                }
            }

            var user = _mapper.Map<User>(request);
            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            var createdUser = await _userRepository.CreateAsync(user);

            await _leaveBalanceManager.CreateInitialBalancesForUserAsync(createdUser.Id);

            return _mapper.Map<UserResponse>(createdUser);
        }

        public async Task<UserResponse?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            
            if (user == null) return null;
            
            return _mapper.Map<UserResponse>(user);
        }

        public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            
            return _mapper.Map<IEnumerable<UserResponse>>(users);
        }

        public async Task<PaginatedResult<UserResponse>> GetAllUsersPaginatedAsync(PaginationQuery pagination)
        {
            var roles = await _userRepository.GetAllPaginatedAsync(pagination);

            var responses = _mapper.Map<IEnumerable<UserResponse>>(roles.Items).ToList();

            return new PaginatedResult<UserResponse>
            {
                Items = responses,
                PageNumber = roles.PageNumber,
                PageSize = roles.PageSize,
                TotalRecords = roles.TotalRecords
            };
        }

        public async Task<UserResponse> UpdateUserAsync(Guid id, UpdateUserRequest request)
        {
            var user = await _userRepository.GetByIdAsync(id) ?? throw new Exception("User not found");

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                if (await _userRepository.EmailExistsAsync(request.Email))
                {
                    throw new Exception("Email already exists");
                }
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                if (await _userRepository.PhoneNumberExistsAsync(PhoneNumberHelper.Normalize(request.PhoneNumber)))
                {
                    throw new Exception("Phone number already exists");
                }
            }

            if (!string.IsNullOrWhiteSpace(request.Username))
            {
                if (await _userRepository.UsernameExistsAsync(request.Username))
                {
                    throw new Exception("Username already exists");
                }
            }

            user.Username = request.Username ?? user.Username;
            user.Email = request.Email ?? user.Email;
            user.TitleId = request.TitleId ?? user.TitleId;
            user.DepartmentId = request.DepartmentId ?? user.DepartmentId;
            user.TerminationDate = request.TerminationDate ?? user.TerminationDate;
            user.HireDate = request.HireDate ?? user.HireDate;
            user.PriorWorkExperienceMonths = request.PriorWorkExperienceMonths ?? user.PriorWorkExperienceMonths;
            if (request.PhoneNumber != null)
            {
                user.PhoneNumber = PhoneNumberHelper.Normalize(request.PhoneNumber ?? "");
            }
            
            //if (!string.IsNullOrEmpty(request.Password))
            //{
            //    user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
            //}

            var updatedUser = await _userRepository.UpdateAsync(user);
            
            return _mapper.Map<UserResponse>(updatedUser);
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            return await _userRepository.DeleteAsync(id);
        }
    }
}
