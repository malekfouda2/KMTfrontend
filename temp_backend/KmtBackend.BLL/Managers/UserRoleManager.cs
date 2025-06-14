using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Role;
using KmtBackend.Models.DTOs.User;
using MapsterMapper;

namespace KmtBackend.BLL.Managers
{
    /// <summary>
    /// Implementation of user-role management operations using repository pattern
    /// </summary>
    public class UserRoleManager : IUserRoleManager
    {
        /// <summary>
        /// Repository for accessing user data
        /// </summary>
        private readonly IUserRepository _userRepository;

        /// <summary>
        /// Repository for accessing role data
        /// </summary>
        private readonly IRoleRepository _roleRepository;

        /// <summary>
        /// Mapper for transforming between entities and DTOs
        /// </summary>
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor with dependency injection of required services
        /// </summary>
        /// <param name="userRepository">Repository for user operations</param>
        /// <param name="roleRepository">Repository for role operations</param>
        /// <param name="mapper">Object mapper for DTO conversions</param>
        public UserRoleManager(
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            IMapper mapper)
        {
            // Initialize user repository
            _userRepository = userRepository;
            // Initialize role repository
            _roleRepository = roleRepository;
            // Initialize object mapper
            _mapper = mapper;
        }

        /// <summary>
        /// Assigns roles to a user
        /// </summary>
        /// <param name="userId">The user's unique identifier</param>
        /// <param name="request">The request containing role IDs to assign</param>
        /// <returns>Updated user response with new roles</returns>
        public async Task<UserResponse> AssignRolesToUserAsync(Guid userId, AssignRolesRequest request)
        {
            // Get complete user entity with roles included
            var user = await _userRepository.GetUserWithRolesAsync(userId);

            // Throw exception if user not found
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Get all specified roles from the repository
            var rolesToAssign = new List<Role>();
            foreach (var roleId in request.RoleIds)
            {
                // Get each role by ID
                var role = await _roleRepository.GetByIdAsync(roleId);

                // Check if role exists
                if (role == null)
                {
                    throw new Exception($"Role with ID {roleId} not found");
                }

                // Add to the list of roles to assign
                rolesToAssign.Add(role);
            }

            // Clear existing roles and assign new ones
            user.Roles.Clear();

            // Add each role to the user's role collection
            foreach (var role in rolesToAssign)
            {
                user.Roles.Add(role);
            }

            // Save the updated user with new roles
            var updatedUser = await _userRepository.UpdateAsync(user);

            // Map to response DTO and return
            return _mapper.Map<UserResponse>(updatedUser);
        }

        /// <summary>
        /// Gets all roles assigned to a user
        /// </summary>
        /// <param name="userId">The user's unique identifier</param>
        /// <returns>Collection of roles assigned to the user</returns>
        public async Task<IEnumerable<RoleResponse>> GetUserRolesAsync(Guid userId)
        {
            // Get user with roles included
            var user = await _userRepository.GetUserWithRolesAsync(userId);

            // Return empty list if user not found
            if (user == null)
            {
                return Enumerable.Empty<RoleResponse>();
            }

            // Map the collection of roles to role responses
            return _mapper.Map<IEnumerable<RoleResponse>>(user.Roles);
        }
    }
}
