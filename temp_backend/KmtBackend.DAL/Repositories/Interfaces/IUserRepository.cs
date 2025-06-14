using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);

        Task<IEnumerable<User>> GetByIdsAsync(IEnumerable<Guid> ids);

        Task<User?> GetByEmailAsync(string email);

        Task<User?> GetByPhoneNumberAsync(string phoneNumber);

        Task<User?> GetByUsernameAsync(string username);
        
        Task<IEnumerable<User>> GetAllAsync();

        Task<PaginatedResult<User>> GetAllPaginatedAsync(PaginationQuery pagination);

        Task<IEnumerable<User>> GetByDepartmentAsync(Guid departmentId);

        Task<IEnumerable<User>> GetByTitleAsync(Guid titleId);

        Task<User> CreateAsync(User user);
        
        Task<User> UpdateAsync(User user);
        
        Task<bool> DeleteAsync(Guid id);
        
        Task<bool> EmailExistsAsync(string email);

        Task<bool> PhoneNumberExistsAsync(string phoneNumber);

        Task<bool> UsernameExistsAsync(string username);

        Task<User?> GetUserWithRolesAsync(Guid id);
    }
}
