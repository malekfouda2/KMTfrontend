using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Permission;
using KmtBackend.Models.DTOs.Role;
using MapsterMapper;

namespace KmtBackend.BLL.Managers
{
    public class RoleManager : IRoleManager
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IPermissionRepository _permissionRepository;
        private readonly IMapper _mapper;

        public RoleManager(
            IRoleRepository roleRepository,
            IPermissionRepository permissionRepository,
            IMapper mapper)
        {
            _roleRepository = roleRepository;
            _permissionRepository = permissionRepository;
            _mapper = mapper;
        }
        
        public async Task<IEnumerable<RoleResponse>> GetAllRolesAsync()
        {
            var roles = await _roleRepository.GetAllWithPermissionsAsync();
            return _mapper.Map<IEnumerable<RoleResponse>>(roles);
        }

        public async Task<PaginatedResult<RoleResponse>> GetAllRolesPaginatedAsync(PaginationQuery pagination)
        {
            var roles = await _roleRepository.GetAllPaginatedAsync(pagination);

            var responses = _mapper.Map<IEnumerable<RoleResponse>>(roles.Items).ToList();

            return new PaginatedResult<RoleResponse>
            {
                Items = responses,
                PageNumber = roles.PageNumber,
                PageSize = roles.PageSize,
                TotalRecords = roles.TotalRecords
            };
        }

        public async Task<RoleResponse?> GetRoleByIdAsync(Guid id)
        {
            var role = await _roleRepository.GetWithPermissionsAsync(id);
            if (role == null) return null;
            return _mapper.Map<RoleResponse>(role);
        }
        
        public async Task<RoleResponse> CreateRoleAsync(CreateRoleRequest request)
        {
            if (await _roleRepository.NameExistsAsync(request.Name))
            {
                throw new Exception("Role name already exists");
            }

            var role = new Role
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                NameAr = request.NameAr,
                Description = request.Description,
                DescriptionAr = request.DescriptionAr,
                CreatedAt = DateTime.UtcNow
            };

            if (request.PermissionIds != null && request.PermissionIds.Any())
            {
                var rolePermissions = await _permissionRepository.GetByIdsAsync(request.PermissionIds);
                role.Permissions = rolePermissions.ToList();
            }

            var createdRole = await _roleRepository.CreateAsync(role);
            
            return _mapper.Map<RoleResponse>(createdRole);
        }
        
        public async Task<RoleResponse> UpdateRoleAsync(Guid id, UpdateRoleRequest request)
        {
            var role = await _roleRepository.GetByIdAsync(id) ?? throw new Exception("Role not found");

            if (request.Name != null && request.Name != role.Name && await _roleRepository.NameExistsAsync(request.Name))
            {
                throw new Exception("Role name already exists");
            }
            
            role.Name = request.Name ?? role.Name;
            role.NameAr = request.NameAr ?? role.NameAr;
            role.Description = request.Description ?? role.Description;
            role.DescriptionAr = request.DescriptionAr ?? role.DescriptionAr;
            role.UpdatedAt = DateTime.UtcNow;         
            
            if (request.PermissionIds != null)
            {
                var newPermissions = await _permissionRepository.GetByIdsAsync(request.PermissionIds);
                role.Permissions.Clear();
                role.Permissions = [.. newPermissions];
            }

            var updatedRole = await _roleRepository.UpdateAsync(role);

            return _mapper.Map<RoleResponse>(updatedRole!);
        }
        
        public async Task<bool> DeleteRoleAsync(Guid id)
        {
            return await _roleRepository.DeleteAsync(id);
        }

        //public async Task<RoleResponse> AssignPermissionsAsync(Guid id, AssignPermissionsRequest request)
        //{
        //    var role = await _roleRepository.GetByIdAsync(id) ?? throw new Exception("Role not found");

        //    if (request.PermissionIds.Count != 0)
        //    {
        //        var permissions = await _permissionRepository.GetByIdsAsync(request.PermissionIds);
        //        var foundPermissionIds = permissions.Select(p => p.Id).ToList();
                
        //        var notFoundIds = request.PermissionIds.Except(foundPermissionIds).ToList();
        //        if (notFoundIds.Count != 0)
        //        {
        //            throw new Exception($"Some permissions were not found: {string.Join(", ", notFoundIds)}");
        //        }
        //        await _roleRepository.AssignPermissionsAsync(id, permissions.ToList());
        //    }
            
        //    var updatedRole = await _roleRepository.GetWithPermissionsAsync(id) ?? throw new Exception("Role not found after update");

        //    return _mapper.Map<RoleResponse>(updatedRole);
        //}
    }
}
