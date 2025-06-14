using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    // Department repository implementation
    public class DepartmentRepository : IDepartmentRepository
    {
        // Database context
        private readonly KmtDbContext _context;
        
        // Constructor with DI
        public DepartmentRepository(KmtDbContext context)
        {
            // Store context
            _context = context;
        }

        // Get department by ID
        public async Task<Department?> GetByIdAsync(Guid id)
        {
            // Query database for department
            return await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        // Get all departments
        public async Task<PaginatedResult<Department>> GetAllAsync(PaginationQuery pagination)
        {
            var query = _context.Departments.AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query.OrderBy(d => d.Name) // Consistent sorting!
                                   .ApplyPagination(pagination)
                                   .ToListAsync();

            return new PaginatedResult<Department>
            {
                Items = items,
                TotalRecords = totalCount,
                PageSize = pagination.PageSize,
                PageNumber = pagination.PageNumber
            };
        }

        // Create new department
        public async Task<Department> CreateAsync(Department department)
        {
            // Add to context
            await _context.Departments.AddAsync(department);
            // Save changes
            await _context.SaveChangesAsync();
            // Return created department
            return department;
        }

        // Update existing department
        public async Task<Department> UpdateAsync(Department department)
        {
            // Mark as modified
            _context.Departments.Update(department);
            // Set update timestamp
            department.UpdatedAt = DateTime.UtcNow;
            // Save changes
            await _context.SaveChangesAsync();
            // Return updated department
            return department;
        }

        // Delete department
        public async Task<bool> DeleteAsync(Guid id)
        {
            // Find department
            var department = await _context.Departments.FindAsync(id);
            // Return false if not found
            if (department == null) return false;
            
            // Remove from context
            _context.Departments.Remove(department);
            // Save and return result
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

