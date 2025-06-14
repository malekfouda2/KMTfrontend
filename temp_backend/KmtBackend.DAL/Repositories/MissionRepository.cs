using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class MissionRepository : IMissionRepository
    {
        private readonly KmtDbContext _context;

        public MissionRepository(KmtDbContext context)
        {
            _context = context;
        }

        public async Task<Mission?> GetByIdAsync(Guid id)
        {
            return await _context.Missions
                .Include(m => m.CreatedBy)
                .Include(m => m.Users)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Mission>> GetAllAsync()
        {
            return await _context.Missions
                .Include(m => m.CreatedBy)
                .ToListAsync();
        }

        public async Task<PaginatedResult<Mission>> GetAllPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.Missions
                .Include(m => m.CreatedBy)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(m => m.CreatedAt)
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<Mission>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<PaginatedResult<Mission>> GetByCreatorIdPaginatedAsync(Guid creatorId, PaginationQuery pagination)
        {
            var query = _context.Missions
                .Include(m => m.CreatedBy)
                .Where(m => m.CreatedById == creatorId)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(m => m.CreatedAt)
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<Mission>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<PaginatedResult<Mission>> GetByUserAssignmentPaginatedAsync(Guid userId, PaginationQuery pagination)
        {
            //var query = _context.MissionAssignments
            //    .Where(ma => ma.UserId == userId)
            //    .Select(ma => ma.Mission)
            //    .Include(m => m.CreatedBy)
            //    .AsNoTracking();

            var query = _context.Missions
                .Where(m => m.Users.Select(u => u.Id).Contains(userId))
                .Include(m => m.CreatedBy)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(m => m.MissionDate)
                .ThenBy(m => m.StartTime)
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<Mission>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<Mission> CreateAsync(Mission mission)
        {
            await _context.Missions.AddAsync(mission);
            await _context.SaveChangesAsync();
            return mission;
        }

        public async Task<Mission> UpdateAsync(Mission mission)
        {
            mission.UpdatedAt = DateTime.UtcNow;
            _context.Missions.Update(mission);
            await _context.SaveChangesAsync();
            return mission;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var mission = await _context.Missions.FindAsync(id);
            if (mission == null)
                return false;

            _context.Missions.Remove(mission);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}