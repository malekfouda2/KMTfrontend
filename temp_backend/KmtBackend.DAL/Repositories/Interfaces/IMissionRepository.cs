using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    public interface IMissionRepository
    {
        Task<Mission?> GetByIdAsync(Guid id);
        Task<IEnumerable<Mission>> GetAllAsync();
        Task<PaginatedResult<Mission>> GetAllPaginatedAsync(PaginationQuery pagination);
        Task<PaginatedResult<Mission>> GetByCreatorIdPaginatedAsync(Guid creatorId, PaginationQuery pagination);
        Task<PaginatedResult<Mission>> GetByUserAssignmentPaginatedAsync(Guid userId, PaginationQuery pagination);
        Task<Mission> CreateAsync(Mission mission);
        Task<Mission> UpdateAsync(Mission mission);
        Task<bool> DeleteAsync(Guid id);
    }
}