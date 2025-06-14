using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Title;

namespace KmtBackend.BLL.Managers.Interfaces
{
    public interface ITitleManager
    {
        Task<TitleResponse?> GetTitleByIdAsync(Guid id);
        
        Task<IEnumerable<TitleResponse>> GetAllTitlesAsync();

        Task<PaginatedResult<TitleResponse>> GetAllTitlesPaginatedAsync(PaginationQuery pagination);

        Task<TitleResponse> CreateTitleAsync(CreateTitleRequest request);
        
        Task<TitleResponse> UpdateTitleAsync(Guid id, UpdateTitleRequest request);
        
        Task<bool> DeleteTitleAsync(Guid id);
    }
}

