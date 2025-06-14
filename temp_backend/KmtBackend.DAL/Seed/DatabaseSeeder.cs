using KmtBackend.DAL.Constants;
using KmtBackend.DAL.Context;
using KmtBackend.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace KmtBackend.DAL.Seed
{
    public static class DatabaseSeeder
    {
        public static async Task SeedDatabaseAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;
            
            try
            {
                var context = services.GetRequiredService<KmtDbContext>();
                var logger = services.GetRequiredService<ILogger<KmtDbContext>>();
                
                logger.LogInformation("Applying pending migrations if any...");
                await context.Database.MigrateAsync();
                
                logger.LogInformation("Seeding database...");

                await SeedPermissionsAsync(context, logger);

                await SeedRolesAsync(context, logger);

                await SeedSuperAdminAsync(context, logger);

                await SeedLeaveTypesAsync(context, logger);

                logger.LogInformation("Database seeding completed successfully.");
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<KmtDbContext>>();
                logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }


        private static async Task SeedPermissionsAsync(KmtDbContext context, ILogger logger)
        {
            logger.LogInformation("Seeding permissions...");

            var allPermissions = Permissions.GetAllPermissionsWithDescriptions();

            if (!await context.Permissions.AnyAsync())
            {
                logger.LogInformation("Creating {Count} permissions", allPermissions.Count);

                foreach (var permissionPair in allPermissions)
                {
                    var permission = new Permission
                    {
                        Id = Guid.NewGuid(),
                        Code = permissionPair.Key,
                        Description = permissionPair.Value.Description,
                        DescriptionAr = permissionPair.Value.DescriptionAr,
                        CreatedAt = DateTime.UtcNow
                    };

                    await context.Permissions.AddAsync(permission);
                }

                await context.SaveChangesAsync();

                logger.LogInformation("Permissions seeded successfully");
            }
            else
            {
                logger.LogInformation("Permissions already exist in database");
            }
        }


        private static async Task SeedRolesAsync(KmtDbContext context, ILogger logger)
        {
            logger.LogInformation("Seeding roles...");

            var adminRole = await context.Roles.Where(r => r.Name == "Super Admin")
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync();

            var allPermissions = await context.Permissions.ToListAsync();

            if (adminRole == null)
            {
                logger.LogInformation("Creating Super Admin role");

                adminRole = new Role
                {
                    Id = Guid.NewGuid(),
                    Name = "Super Admin",
                    NameAr = "مدير النظام",
                    Description = "Has full access to all system features",
                    DescriptionAr = "لديه وصول كامل إلى جميع ميزات النظام",
                    CreatedAt = DateTime.UtcNow
                };

                adminRole.Permissions = allPermissions;

                await context.Roles.AddAsync(adminRole);

                await context.SaveChangesAsync();

                logger.LogInformation("Super Admin role created with all permissions");
            }
            else
            {
                var assignedPermissions = adminRole.Permissions.ToList();

                var missingPermissions = allPermissions.Except(assignedPermissions).ToList();

                foreach (var missingPermission in missingPermissions)
                {
                    adminRole.Permissions.Add(missingPermission);
                }
                await context.SaveChangesAsync();
            }
        }


        private static async Task SeedSuperAdminAsync(KmtDbContext context, ILogger logger)
        {
            logger.LogInformation("Seeding super admin user...");

            if (await context.Users.AnyAsync(u => u.Email == "admin@admin.com"))
            {
                logger.LogInformation("Super admin user already exists");
                return;
            }

            var passwordHasher = new PasswordHasher<User>();

            var superAdmin = new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                Email = "admin@admin.com",
                CreatedAt = DateTime.UtcNow,
                PhoneNumber = "1010101010",
                PriorWorkExperienceMonths = 24,
                HireDate = DateTime.UtcNow,
                Gender = Models.Enums.Gender.Male
            };

            superAdmin.PasswordHash = passwordHasher.HashPassword(superAdmin, "Admin@123");

            await context.Users.AddAsync(superAdmin);
            await context.SaveChangesAsync();

            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Super Admin");

            if (adminRole != null)
            {
                superAdmin.Roles.Add(adminRole);

                await context.SaveChangesAsync();

                logger.LogInformation("Assigned Super Admin role to admin user");
            }
            else
            {
                logger.LogWarning("Super Admin role not found, unable to assign to admin user");
            }

            logger.LogInformation("Super admin user created successfully");
        }

        private static async Task SeedLeaveTypesAsync(KmtDbContext context, ILogger logger)
        {
            logger.LogInformation("Seeding leave types...");

            if (!await context.LeaveTypes.AnyAsync())
            {
                logger.LogInformation("Creating leave types based on Egyptian labor law...");

                var leaveTypeDefinitions = LeaveConstants.GetAllLeaveTypes();
                var leaveTypes = new List<LeaveType>();

                foreach (var leaveType in leaveTypeDefinitions)
                {
                    leaveTypes.Add(new LeaveType
                    {
                        Id = Guid.NewGuid(),
                        Name = leaveType.Key,
                        NameAr = leaveType.Value.NameAr,
                        Description = leaveType.Value.Description,
                        DescriptionAr = leaveType.Value.DescriptionAr,
                        IsSeniorityBased = leaveType.Value.IsSeniorityBased,
                        AllowCarryOver = leaveType.Value.AllowCarryOver,
                        IsGenderSpecific = leaveType.Value.IsGenderSpecific,
                        ApplicableGender = leaveType.Value.ApplicableGender,
                        IsLimitedFrequency = leaveType.Value.IsLimitedFrequency,
                        //MinServiceMonths = leaveType.Value.MinServiceMonths,
                        MaxUses = leaveType.Value.MaxUses,
                        CreatedAt = DateTime.UtcNow
                    });
                }

                await context.LeaveTypes.AddRangeAsync(leaveTypes);
                await context.SaveChangesAsync();
                logger.LogInformation("Leave types seeded successfully.");
            }
            else
            {
                logger.LogInformation("Leave types already exist in database.");
            }
        }
    }
}
