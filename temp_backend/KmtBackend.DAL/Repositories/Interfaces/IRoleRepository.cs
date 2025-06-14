using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>> GetAllAsync();
        Task<PaginatedResult<Role>> GetAllPaginatedAsync(PaginationQuery pagination);
        Task<Role?> GetByIdAsync(Guid id);
        Task<Role?> GetByNameAsync(string name);
        Task<Role> CreateAsync(Role role);
        Task<Role> UpdateAsync(Role role);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> AssignPermissionsAsync(Guid roleId, IEnumerable<Permission> permissions);
        Task<bool> NameExistsAsync(string name);
        Task<IEnumerable<Role>> GetAllWithPermissionsAsync();
        Task<Role?> GetWithPermissionsAsync(Guid id);
    }
}
