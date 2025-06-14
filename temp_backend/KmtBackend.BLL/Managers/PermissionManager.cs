using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Permission;
using MapsterMapper;

namespace KmtBackend.BLL.Managers
{
    public class PermissionManager : IPermissionManager
    {
        private readonly IPermissionRepository _permissionRepository;
        private readonly IMapper _mapper;
        
        public PermissionManager(
            IPermissionRepository permissionRepository,
            IMapper mapper)
        {
            _permissionRepository = permissionRepository;
            _mapper = mapper;
        }
        
        public async Task<IEnumerable<PermissionResponse>> GetAllPermissionsAsync()
        {
            var permissions = await _permissionRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PermissionResponse>>(permissions);
        }

        public async Task<PaginatedResult<PermissionResponse>> GetAllPermissionsPaginatedAsync(PaginationQuery pagination)
        {
            var permissions = await _permissionRepository.GetAllPaginatedAsync(pagination);

            var responses = _mapper.Map<IEnumerable<PermissionResponse>>(permissions.Items).ToList();

            return new PaginatedResult<PermissionResponse>
            {
                Items = responses,
                PageNumber = permissions.PageNumber,
                PageSize = permissions.PageSize,
                TotalRecords = permissions.TotalRecords
            };
        }

        public async Task<PermissionResponse?> GetPermissionByIdAsync(Guid id)
        {
            var permission = await _permissionRepository.GetByIdAsync(id);
            if (permission == null) return null;
            return _mapper.Map<PermissionResponse>(permission);
        }
    }
}
