using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.User;

namespace KmtBackend.BLL.Managers.Interfaces
{
    public interface IUserManager
    {
        Task<UserResponse> CreateUserAsync(CreateUserRequest request);
        
        Task<UserResponse?> GetUserByIdAsync(Guid id);
        
        Task<IEnumerable<UserResponse>> GetAllUsersAsync();

        Task<PaginatedResult<UserResponse>> GetAllUsersPaginatedAsync(PaginationQuery pagination);


        Task<UserResponse> UpdateUserAsync(Guid id, UpdateUserRequest request);
        
        Task<bool> DeleteUserAsync(Guid id);
    }
}
