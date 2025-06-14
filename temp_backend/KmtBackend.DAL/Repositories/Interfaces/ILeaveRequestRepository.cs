using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface ILeaveRequestRepository
    {
        Task<LeaveRequest?> GetByIdAsync(Guid id);
        Task<IEnumerable<LeaveRequest>> GetByUserIdAsync(Guid userId);
        Task<PaginatedResult<LeaveRequest>> GetByUserIdPaginatedAsync(Guid userId, PaginationQuery pagination);
        Task<PaginatedResult<LeaveRequest>> GetByDepartmentIdPaginatedAsync(Guid departmentId, PaginationQuery pagination);
        Task<PaginatedResult<LeaveRequest>> GetPendingRequestsPaginatedAsync(PaginationQuery pagination);
        Task<PaginatedResult<LeaveRequest>> GetAllPaginatedAsync(PaginationQuery pagination);
        Task<LeaveRequest> CreateAsync(LeaveRequest leaveRequest);
        Task<LeaveRequest> UpdateAsync(LeaveRequest leaveRequest);
        Task<bool> DeleteAsync(Guid id);
    }
}