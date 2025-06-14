using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Permission;

namespace KmtBackend.BLL.Managers.Interfaces
{
    public interface IPermissionManager
    {
        Task<IEnumerable<PermissionResponse>> GetAllPermissionsAsync();
        Task<PaginatedResult<PermissionResponse>> GetAllPermissionsPaginatedAsync(PaginationQuery pagination);
        Task<PermissionResponse?> GetPermissionByIdAsync(Guid id);
    }
}
