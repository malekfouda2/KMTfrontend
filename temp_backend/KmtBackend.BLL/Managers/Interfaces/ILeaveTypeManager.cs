using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Leave;

namespace KmtBackend.BLL.Managers.Interfaces
{
    public interface ILeaveTypeManager
    {
        Task<LeaveTypeResponse?> GetLeaveTypeByIdAsync(Guid id);
        Task<PaginatedResult<LeaveTypeResponse>> GetAllLeaveTypesPaginatedAsync(PaginationQuery pagination);
    }
}
