using KmtBackend.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace KmtBackend.DAL.Context
{
    public class KmtDbContext : DbContext
    {
        public KmtDbContext(DbContextOptions<KmtDbContext> options)
            : base(options)
        {
            // Empty constructor passes options to base
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Permission> Permissions { get; set; } = null!;
        public DbSet<Title> Titles { get; set; } = null!;
        public DbSet<LeaveType> LeaveTypes { get; set; } = null!;
        public DbSet<LeaveBalance> LeaveBalances { get; set; } = null!;
        public DbSet<LeaveRequest> LeaveRequests { get; set; } = null!;
        public DbSet<Mission> Missions { get; set; } = null!;
        public DbSet<MissionAssignment> MissionAssignments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User email must be unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Department has many users
            modelBuilder.Entity<Department>()
                .HasMany(d => d.Users)
                .WithOne(u => u.Department)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Permission code must be unique
            modelBuilder.Entity<Permission>()
                .HasIndex(p => p.Code)
                .IsUnique();
                
            // Role name must be unique
            modelBuilder.Entity<Role>()
                .HasIndex(r => r.Name)
                .IsUnique();

            // Title has many users
            modelBuilder.Entity<Title>()
                .HasMany(d => d.Users)
                .WithOne(u => u.Title)
                .HasForeignKey(u => u.TitleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Leave types must have unique names
            modelBuilder.Entity<LeaveType>()
                .HasIndex(lt => lt.Name)
                .IsUnique();

            // User - LeaveBalance relationship
            modelBuilder.Entity<LeaveBalance>()
                .HasOne(lb => lb.User)
                .WithMany(u => u.LeaveBalances)
                .HasForeignKey(lb => lb.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint: one balance per user, type and year
            modelBuilder.Entity<LeaveBalance>()
                .HasIndex(lb => new { lb.UserId, lb.LeaveTypeId, lb.Year })
                .IsUnique();

            modelBuilder.Entity<LeaveBalance>()
                .Property(lb => lb.UsedDays)
                .HasColumnType("decimal(5,2)");

            // User - LeaveRequest relationship
            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.User)
                .WithMany(u => u.LeaveRequests)
                .HasForeignKey(lr => lr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Mission>()
                .HasOne(m => m.CreatedBy)
                .WithMany(u => u.CreatedMissions)
                .HasForeignKey(m => m.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Missions)
                .WithMany(m => m.Users)
                .UsingEntity<MissionAssignment>();

            modelBuilder.Entity<MissionAssignment>()
                .HasOne(ma => ma.AssignedBy)
                .WithMany()
                .HasForeignKey(ma => ma.AssignedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Call base implementation
            base.OnModelCreating(modelBuilder);
        }
    }
}
