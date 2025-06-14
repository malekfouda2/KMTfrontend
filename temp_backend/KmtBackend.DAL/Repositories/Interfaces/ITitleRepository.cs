using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface ITitleRepository
    {
        Task<Title?> GetByIdAsync(Guid id);
        
        Task<IEnumerable<Title>> GetAllAsync();

        Task<PaginatedResult<Title>> GetAllPaginatedAsync(PaginationQuery pagination);

        Task<Title> CreateAsync(Title title);
        
        Task<Title> UpdateAsync(Title title);
        
        Task<bool> DeleteAsync(Guid id);
    }
}

