namespace KmtBackend.API.DTOs.Auth
{
    // Login response with token
    public class LoginResponse
    {
        // JWT token for authorization
        public string Token { get; set; } = null!;
        
        // User information
        public UserDto User { get; set; } = null!;
    }

    // User information for response
    public class UserDto
    {
        // User ID
        public Guid Id { get; set; }
        
        // Username
        public string Username { get; set; } = null!;
        
        // Email address
        public string? Email { get; set; } = null!;

        // Phone Number
        public string? PhoneNumber { get; set; } = null!;

        // Job title
        public string? Title { get; set; }
        
        // Department information
        public DepartmentDto? Department { get; set; }
    }

    // Department information for response
    public class DepartmentDto
    {
        // Department ID
        public Guid Id { get; set; }
        
        // Name (localized based on language)
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
