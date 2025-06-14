using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Leave;
using MapsterMapper;

namespace KmtBackend.BLL.Managers
{
    public class LeaveTypeManager : ILeaveTypeManager
    {
        private readonly ILeaveTypeRepository _leaveTypeRepository;
        private readonly IMapper _mapper;

        public LeaveTypeManager(ILeaveTypeRepository leaveTypeRepository, IMapper mapper)
        {
            _leaveTypeRepository = leaveTypeRepository;
            _mapper = mapper;
        }

        public async Task<LeaveTypeResponse?> GetLeaveTypeByIdAsync(Guid id)
        {
            var leaveType = await _leaveTypeRepository.GetByIdAsync(id);
            if (leaveType == null) return null;

            return _mapper.Map<LeaveTypeResponse>(leaveType);
        }

        public async Task<PaginatedResult<LeaveTypeResponse>> GetAllLeaveTypesPaginatedAsync(PaginationQuery pagination)
        {
            var result = await _leaveTypeRepository.GetAllPaginatedAsync(pagination);

            var responses = _mapper.Map<IEnumerable<LeaveTypeResponse>>(result.Items).ToList();

            return new PaginatedResult<LeaveTypeResponse>
            {
                Items = responses,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords
            };
        }
    }
}
