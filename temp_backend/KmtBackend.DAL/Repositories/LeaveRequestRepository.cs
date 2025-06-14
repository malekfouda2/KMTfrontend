using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class LeaveRequestRepository : ILeaveRequestRepository
    {
        private readonly KmtDbContext _context;

        public LeaveRequestRepository(KmtDbContext context)
        {
            _context = context;
        }

        public async Task<LeaveRequest?> GetByIdAsync(Guid id)
        {
            return await _context.LeaveRequests
                .Include(lr => lr.User)
                .Include(lr => lr.LeaveType)
                .Include(lr => lr.ProcessedBy)
                .FirstOrDefaultAsync(lr => lr.Id == id);
        }

        public async Task<IEnumerable<LeaveRequest>> GetByUserIdAsync(Guid userId)
        {
            return await _context.LeaveRequests
                .Include(lr => lr.LeaveType)
                .Where(lr => lr.UserId == userId)
                .OrderByDescending(lr => lr.StartDate)
                .ToListAsync();
        }

        public async Task<PaginatedResult<LeaveRequest>> GetByUserIdPaginatedAsync(Guid userId, PaginationQuery pagination)
        {
            var query = _context.LeaveRequests
                .Include(lr => lr.LeaveType)
                .Where(lr => lr.UserId == userId)
                .OrderByDescending(lr => lr.StartDate)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<LeaveRequest>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<PaginatedResult<LeaveRequest>> GetByDepartmentIdPaginatedAsync(Guid departmentId, PaginationQuery pagination)
        {
            var query = _context.LeaveRequests
                .Include(lr => lr.User)
                .Include(lr => lr.LeaveType)
                .Where(lr => lr.User.DepartmentId == departmentId)
                .OrderByDescending(lr => lr.CreatedAt)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<LeaveRequest>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<PaginatedResult<LeaveRequest>> GetPendingRequestsPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.LeaveRequests
                .Include(lr => lr.User)
                .Include(lr => lr.LeaveType)
                .Where(lr => lr.Status == LeaveRequestStatus.Pending)
                .OrderBy(lr => lr.StartDate)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<LeaveRequest>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<PaginatedResult<LeaveRequest>> GetAllPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.LeaveRequests
                .Include(lr => lr.User)
                .Include(lr => lr.LeaveType)
                .OrderByDescending(lr => lr.CreatedAt)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<LeaveRequest>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<LeaveRequest> CreateAsync(LeaveRequest leaveRequest)
        {
            await _context.LeaveRequests.AddAsync(leaveRequest);
            await _context.SaveChangesAsync();
            return leaveRequest;
        }

        public async Task<LeaveRequest> UpdateAsync(LeaveRequest leaveRequest)
        {
            leaveRequest.UpdatedAt = DateTime.UtcNow;
            _context.LeaveRequests.Update(leaveRequest);
            await _context.SaveChangesAsync();
            return leaveRequest;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var leaveRequest = await _context.LeaveRequests.FindAsync(id);
            if (leaveRequest == null) return false;

            _context.LeaveRequests.Remove(leaveRequest);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}