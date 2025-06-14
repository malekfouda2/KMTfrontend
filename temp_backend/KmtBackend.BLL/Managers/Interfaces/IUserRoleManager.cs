using KmtBackend.Models.DTOs.Role;
using KmtBackend.Models.DTOs.User;

namespace KmtBackend.BLL.Managers.Interfaces
{
    /// <summary>
    /// Interface for managing user-role assignments
    /// </summary>
    public interface IUserRoleManager
    {
        /// <summary>
        /// Assigns roles to a user
        /// </summary>
        /// <param name="userId">The user's unique identifier</param>
        /// <param name="request">The request containing role IDs</param>
        /// <returns>Updated user response</returns>
        Task<UserResponse> AssignRolesToUserAsync(Guid userId, AssignRolesRequest request);
        
        /// <summary>
        /// Gets all roles for a user
        /// </summary>
        /// <param name="userId">The user's unique identifier</param>
        /// <returns>Collection of role responses</returns>
        Task<IEnumerable<RoleResponse>> GetUserRolesAsync(Guid userId);
    }
}
