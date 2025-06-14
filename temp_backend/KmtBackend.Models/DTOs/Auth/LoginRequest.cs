using System.ComponentModel.DataAnnotations;

namespace KmtBackend.Models.DTOs.Auth
{
    public class LoginRequest : IValidatableObject
    {
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        [Required]
        public string Password { get; set; } = null!;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var hasEmail = !string.IsNullOrWhiteSpace(Email);
            var hasPhone = !string.IsNullOrWhiteSpace(PhoneNumber);

            if (hasEmail == hasPhone)
            {
                yield return new ValidationResult(
                    "You must provide either an email or a phone number, but not both.",
                    [nameof(Email), nameof(PhoneNumber)]
                );
            }
        }
    }
}
