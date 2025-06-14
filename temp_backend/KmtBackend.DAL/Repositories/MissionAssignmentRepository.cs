using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Repositories
{
    public class MissionAssignmentRepository : IMissionAssignmentRepository
    {
        private readonly KmtDbContext _context;

        public MissionAssignmentRepository(KmtDbContext context)
        {
            _context = context;
        }

        public async Task<MissionAssignment?> GetByMissionAndUserAsync(Guid missionId, Guid userId)
        {
            return await _context.MissionAssignments
                .Include(ma => ma.User)
                .Include(ma => ma.Mission)
                .Include(ma => ma.AssignedBy)
                .FirstOrDefaultAsync(ma => ma.MissionId == missionId && ma.UserId == userId);
        }

        public async Task<IEnumerable<MissionAssignment>> GetByMissionIdAsync(Guid missionId)
        {
            return await _context.MissionAssignments
                .Include(ma => ma.User)
                .Include(ma => ma.AssignedBy)
                .Where(ma => ma.MissionId == missionId)
                .ToListAsync();
        }

        public async Task<IEnumerable<MissionAssignment>> GetByUserIdAsync(Guid userId)
        {
            return await _context.MissionAssignments
                .Include(ma => ma.Mission)
                .Include(ma => ma.AssignedBy)
                .Where(ma => ma.UserId == userId)
                .ToListAsync();
        }

        public async Task<MissionAssignment> CreateAsync(MissionAssignment assignment)
        {
            await _context.MissionAssignments.AddAsync(assignment);
            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var missionAssignment = await _context.MissionAssignments.FindAsync(id);

            if (missionAssignment == null) return false;

            _context.MissionAssignments.Remove(missionAssignment);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}