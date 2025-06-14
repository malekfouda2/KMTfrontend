using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Leave;

namespace KmtBackend.BLL.Managers.Interfaces
{
    public interface ILeaveBalanceManager
    {
        Task<LeaveBalanceResponse?> GetLeaveBalanceByIdAsync(Guid id);
        Task<IEnumerable<LeaveBalanceResponse>> GetUserLeaveBalancesAsync(Guid userId, int? year);
        Task<LeaveBalanceResponse> UpdateLeaveBalanceAsync(Guid id, UpdateLeaveBalanceRequest request);
        Task<bool> CreateInitialBalancesForUserAsync(Guid userId);
        Task<int> ResetAllUserBalancesAsync(int year);
    }
}
