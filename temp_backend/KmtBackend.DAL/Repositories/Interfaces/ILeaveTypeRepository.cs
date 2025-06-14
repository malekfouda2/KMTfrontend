using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface ILeaveTypeRepository
    {
        Task<LeaveType?> GetByIdAsync(Guid id);
        Task<IEnumerable<LeaveType>> GetAllAsync();
        Task<PaginatedResult<LeaveType>> GetAllPaginatedAsync(PaginationQuery pagination);
        Task<LeaveType?> GetByNameAsync(string name);
    }
}