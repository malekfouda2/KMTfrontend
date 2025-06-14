using KmtBackend.DAL.Entities;
using KmtBackend.Models.DTOs.Common;

namespace KmtBackend.DAL.Repositories.Interfaces
{
    // Department repository interface
    public interface IDepartmentRepository
    {
        // Get department by ID
        Task<Department?> GetByIdAsync(Guid id);

        // Get all departments
        Task<PaginatedResult<Department>> GetAllAsync(PaginationQuery pagination);
        
        // Create new department
        Task<Department> CreateAsync(Department department);
        
        // Update existing department
        Task<Department> UpdateAsync(Department department);
        
        // Delete department
        Task<bool> DeleteAsync(Guid id);
    }
}

