using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class TitleRepository : ITitleRepository
    {
        private readonly KmtDbContext _context;
        
        public TitleRepository(KmtDbContext context)
        {
            _context = context;
        }

        public async Task<Title?> GetByIdAsync(Guid id)
        {
            return await _context.Titles
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<IEnumerable<Title>> GetAllAsync()
        {
            return await _context.Titles.ToListAsync();
        }

        public async Task<PaginatedResult<Title>> GetAllPaginatedAsync(PaginationQuery pagination)
        {
            var query = _context.Titles.AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query.OrderBy(t => t.Name)
                                   .ApplyPagination(pagination)
                                   .ToListAsync();

            return new PaginatedResult<Title>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        public async Task<Title> CreateAsync(Title title)
        {
            await _context.Titles.AddAsync(title);
            await _context.SaveChangesAsync();
            return title;
        }

        public async Task<Title> UpdateAsync(Title title)
        {
            _context.Titles.Update(title);
            title.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return title;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var title = await _context.Titles.FindAsync(id);

            if (title == null) return false;
            
            _context.Titles.Remove(title);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

