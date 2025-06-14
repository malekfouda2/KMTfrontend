using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface ILeaveBalanceRepository
    {
        Task<LeaveBalance?> GetByIdAsync(Guid id);
        Task<IEnumerable<LeaveBalance>> GetByUserIdAsync(Guid userId, int? year = null);
        Task<LeaveBalance?> GetUserBalanceAsync(Guid userId, Guid leaveTypeId, int year);
        Task<PaginatedResult<LeaveBalance>> GetAllPaginatedAsync(PaginationQuery pagination);
        Task<LeaveBalance> CreateAsync(LeaveBalance leaveBalance);
        Task<LeaveBalance> UpdateAsync(LeaveBalance leaveBalance);
        Task<bool> CreateInitialBalancesForUserAsync(Guid userId, int year);
        Task<int> ResetAllUserBalancesAsync(int year);
    }
}