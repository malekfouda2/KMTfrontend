using KmtBackend.DAL.Entities;

namespace KmtBackend.Infrastructure.TokenGenerator
{
    // Interface for token generation service
    public interface IJwtTokenGenerator
    {
        // Method to generate a token from user
        string GenerateToken(User user);
    }
}
