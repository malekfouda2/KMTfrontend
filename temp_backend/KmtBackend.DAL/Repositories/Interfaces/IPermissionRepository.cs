using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface IPermissionRepository
    {
        Task<IEnumerable<Permission>> GetAllAsync();
        Task<PaginatedResult<Permission>> GetAllPaginatedAsync(PaginationQuery pagination);
        Task<Permission?> GetByIdAsync(Guid id);
        Task<Permission?> GetByCodeAsync(string code);
        Task<IEnumerable<Permission>> GetByIdsAsync(IEnumerable<Guid> ids);
    }
}
