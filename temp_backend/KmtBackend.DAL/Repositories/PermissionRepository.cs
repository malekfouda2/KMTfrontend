using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly KmtDbContext _context;
        
        public PermissionRepository(KmtDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Permission>> GetAllAsync()
        {
            return await _context.Permissions
                .OrderBy(p => p.Code)
                .ToListAsync();
        }

        public async Task<PaginatedResult<Permission>> GetAllPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.Permissions.AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query.OrderBy(p => p.Code)
                                   .ApplyPagination(pagination)
                                   .ToListAsync();

            return new PaginatedResult<Permission>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<Permission?> GetByIdAsync(Guid id)
        {
            return await _context.Permissions
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Permission?> GetByCodeAsync(string code)
        {
            return await _context.Permissions
                .FirstOrDefaultAsync(p => p.Code.ToLower() == code.ToLower());
        }
        
        public async Task<IEnumerable<Permission>> GetByIdsAsync(IEnumerable<Guid> ids)
        {
            var idsList = ids.ToList();
            
            return await _context.Permissions
                .Where(p => idsList.Contains(p.Id))
                .ToListAsync();
        }
    }
}
