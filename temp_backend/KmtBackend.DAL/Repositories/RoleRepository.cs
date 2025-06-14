using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly KmtDbContext _context;
        
        public RoleRepository(KmtDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            return await _context.Roles
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<PaginatedResult<Role>> GetAllPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.Roles.AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query.OrderBy(r => r.Name)
                .Include(r => r.Permissions)
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<Role>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<Role?> GetByIdAsync(Guid id)
        {
            return await _context.Roles
                .Where(r => r.Id == id)
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync();
        }
        public async Task<Role?> GetByNameAsync(string name)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(r => r.Name.ToLower() == name.ToLower());
        }

        public async Task<Role> CreateAsync(Role role)
        {
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task<Role> UpdateAsync(Role role)
        {
            _context.Roles.Update(role);
            role.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return role;
        }
        
        public async Task<bool> DeleteAsync(Guid id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return false;
            
            _context.Roles.Remove(role);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AssignPermissionsAsync(Guid roleId, IEnumerable<Permission> permissions)
        {
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.Id == roleId);
            
            if (role == null) return false;

            role.Permissions = [.. permissions];
            
            return await _context.SaveChangesAsync() > 0;
        }
        
        public async Task<bool> NameExistsAsync(string name)
        {
            return await _context.Roles
                .AnyAsync(r => r.Name.ToLower() == name.ToLower());
        }
        
        public async Task<IEnumerable<Role>> GetAllWithPermissionsAsync()
        {
            return await _context.Roles
                .Include(r => r.Permissions)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }
        
        public async Task<Role?> GetWithPermissionsAsync(Guid id)
        {
            return await _context.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}
