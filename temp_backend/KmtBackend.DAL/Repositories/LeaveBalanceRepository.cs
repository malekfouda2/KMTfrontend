using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class LeaveBalanceRepository : ILeaveBalanceRepository
    {
        private readonly KmtDbContext _context;

        public LeaveBalanceRepository(KmtDbContext context)
        {
            _context = context;
        }

        public async Task<LeaveBalance?> GetByIdAsync(Guid id)
        {
            return await _context.LeaveBalances
                .Include(lb => lb.LeaveType)
                .FirstOrDefaultAsync(lb => lb.Id == id);
        }

        public async Task<IEnumerable<LeaveBalance>> GetByUserIdAsync(Guid userId, int? year = null)
        {
            var query = _context.LeaveBalances
                .Include(lb => lb.LeaveType)
                .Where(lb => lb.UserId == userId);

            if (year.HasValue)
            {
                query = query.Where(lb => lb.Year == year);
            }

            return await query.ToListAsync();
        }

        public async Task<LeaveBalance?> GetUserBalanceAsync(Guid userId, Guid leaveTypeId, int year)
        {
            return await _context.LeaveBalances
                .FirstOrDefaultAsync(lb => 
                    lb.UserId == userId && 
                    lb.LeaveTypeId == leaveTypeId && 
                    lb.Year == year);
        }

        public async Task<PaginatedResult<LeaveBalance>> GetAllPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.LeaveBalances
                .Include(lb => lb.User)
                .Include(lb => lb.LeaveType)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<LeaveBalance>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<LeaveBalance> CreateAsync(LeaveBalance leaveBalance)
        {
            await _context.LeaveBalances.AddAsync(leaveBalance);
            await _context.SaveChangesAsync();
            return leaveBalance;
        }

        public async Task<LeaveBalance> UpdateAsync(LeaveBalance leaveBalance)
        {
            leaveBalance.UpdatedAt = DateTime.UtcNow;
            _context.LeaveBalances.Update(leaveBalance);
            await _context.SaveChangesAsync();
            return leaveBalance;
        }

        public async Task<bool> CreateInitialBalancesForUserAsync(Guid userId, int year)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            var leaveTypes = await _context.LeaveTypes.ToListAsync();
            
            foreach (var leaveType in leaveTypes)
            {
                // Check if balance already exists
                var existingBalance = await GetUserBalanceAsync(userId, leaveType.Id, year);
                if (existingBalance != null) continue;

                // Create new balance
                var balance = new LeaveBalance
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    LeaveTypeId = leaveType.Id,
                    Year = year,
                    TotalDays = 0, // Will be calculated by the manager
                    UsedDays = 0,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.LeaveBalances.AddAsync(balance);
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<int> ResetAllUserBalancesAsync(int year)
        {
            // Get all active users
            var users = await _context.Users
                .Where(u => u.TerminationDate == null || u.TerminationDate > DateTime.UtcNow)
                .ToListAsync();

            int balancesCreated = 0;
            
            foreach (var user in users)
            {
                var result = await CreateInitialBalancesForUserAsync(user.Id, year);
                if (result) balancesCreated++;
            }

            return balancesCreated;
        }
    }
}