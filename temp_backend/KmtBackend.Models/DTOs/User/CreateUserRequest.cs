using KmtBackend.Models.Enums;

namespace KmtBackend.Models.DTOs.User
{
    public class CreateUserRequest
    {
        public string Username { get; set; } = null!;
        
        public string? Email { get; set; } = null!;

        public string? PhoneNumber { get; set; } = null!;

        // Password (will be hashed)
        public string Password { get; set; } = null!;
        
        public Guid? TitleId { get; set; }
        
        public Guid? DepartmentId { get; set; }

        public DateTime HireDate { get; set; }
        public int PriorWorkExperienceMonths { get; set; }
        public Gender Gender { get; set; }
    }
}
