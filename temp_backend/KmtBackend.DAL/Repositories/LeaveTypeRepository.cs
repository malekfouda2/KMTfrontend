using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class LeaveTypeRepository : ILeaveTypeRepository
    {
        private readonly KmtDbContext _context;
        
        public LeaveTypeRepository(KmtDbContext context)
        {
            _context = context;
        }

        public async Task<LeaveType?> GetByIdAsync(Guid id)
        {
            return await _context.LeaveTypes.FindAsync(id);
        }

        public async Task<IEnumerable<LeaveType>> GetAllAsync()
        {
            return await _context.LeaveTypes.ToListAsync();
        }

        public async Task<PaginatedResult<LeaveType>> GetAllPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.LeaveTypes.AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query.OrderBy(t => t.Name)
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<LeaveType>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<LeaveType?> GetByNameAsync(string name)
        {
            return await _context.LeaveTypes
                .FirstOrDefaultAsync(lt => lt.Name.ToLower() == name.ToLower());
        }
    }
}