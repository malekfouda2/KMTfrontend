using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Role;

namespace KmtBackend.BLL.Managers.Interfaces
{
    public interface IRoleManager
    {
        Task<IEnumerable<RoleResponse>> GetAllRolesAsync();
        Task<PaginatedResult<RoleResponse>> GetAllRolesPaginatedAsync(PaginationQuery pagination);
        Task<RoleResponse?> GetRoleByIdAsync(Guid id);
        Task<RoleResponse> CreateRoleAsync(CreateRoleRequest request);
        Task<RoleResponse> UpdateRoleAsync(Guid id, UpdateRoleRequest request);
        Task<bool> DeleteRoleAsync(Guid id);
        //Task<RoleResponse> AssignPermissionsAsync(Guid id, AssignPermissionsRequest request);
    }
}
