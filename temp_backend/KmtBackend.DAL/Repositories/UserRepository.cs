using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly KmtDbContext _context;
        
        public UserRepository(KmtDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Title)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>> GetByIdsAsync(IEnumerable<Guid> ids)
        {
            var idsList = ids.ToList();

            return await _context.Users
                .Where(u => idsList.Contains(u.Id))
                .Include(u => u.Missions)
                .ToListAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Where(u => u.Email.ToLower() == email.ToLower())
                .Include(u => u.Roles)
                .ThenInclude(rp => rp.Permissions)
                .Include(u => u.Department)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetByPhoneNumberAsync(string phoneNumber)
        {
            return await _context.Users
                .Where(u => u.PhoneNumber.ToLower() == phoneNumber.ToLower())
                .Include(u => u.Roles)
                .ThenInclude(rp => rp.Permissions)
                .Include(u => u.Department)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users
                .Include(u => u.Department)
                .ToListAsync();
        }

        public async Task<PaginatedResult<User>> GetAllPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.Users.AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query.OrderBy(t => t.Username)
                .Include (u => u.Department)
                .Include(u => u.Title)
                .ApplyPagination(pagination)
                .ToListAsync();

            return new PaginatedResult<User>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<IEnumerable<User>> GetByDepartmentAsync(Guid departmentId)
        {
            return await _context.Users
                .Where(u => u.DepartmentId == departmentId)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetByTitleAsync(Guid titleId)
        {
            return await _context.Users
                .Where(u => u.TitleId == titleId)
                .ToListAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;
            
            _context.Users.Remove(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users
                .AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<bool> PhoneNumberExistsAsync(string phoneNumber)
        {
            return await _context.Users
                .AnyAsync(u => u.PhoneNumber == phoneNumber);
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _context.Users
                .AnyAsync(u => u.Username.ToLower() == username.ToLower());
        }

        public async Task<User?> GetUserWithRolesAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.Roles)
                .ThenInclude(r => r.Permissions)
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
