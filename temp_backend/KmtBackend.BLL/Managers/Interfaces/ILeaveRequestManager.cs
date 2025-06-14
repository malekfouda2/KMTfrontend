using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Leave;

namespace KmtBackend.BLL.Managers.Interfaces
{
    public interface ILeaveRequestManager
    {
        Task<LeaveRequestResponse> CreateLeaveRequestAsync(Guid userId, CreateLeaveRequestRequest request);
        Task<LeaveRequestResponse?> GetLeaveRequestByIdAsync(Guid id);
        Task<PaginatedResult<LeaveRequestResponse>> GetUserLeaveRequestsPaginatedAsync(Guid userId, PaginationQuery pagination);
        Task<PaginatedResult<LeaveRequestResponse>> GetDepartmentLeaveRequestsPaginatedAsync(Guid departmentId, PaginationQuery pagination);
        Task<PaginatedResult<LeaveRequestResponse>> GetAllLeaveRequestsPaginatedAsync(PaginationQuery pagination);
        Task<LeaveRequestResponse> ApproveLeaveRequestAsync(Guid id);
        Task<LeaveRequestResponse> RejectLeaveRequestAsync(Guid id, RejectLeaveRequestRequest request);
        Task<bool> CancelLeaveRequestAsync(Guid id);
    }
}
