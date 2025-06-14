using KmtBackend.Models.DTOs.Department;
using KmtBackend.Models.DTOs.Title;

namespace KmtBackend.Models.DTOs.User
{
    // User response DTO
    public class UserResponse
    {
        public Guid Id { get; set; }

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public DepartmentResponse? Department { get; set; }

        public TitleResponse? Title { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
