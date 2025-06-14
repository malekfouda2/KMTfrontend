namespace KmtBackend.Models.DTOs.User
{
    public class UpdateUserRequest
    {
        public string? Username { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public Guid? TitleId { get; set; }

        public Guid? DepartmentId { get; set; }

        public DateTime? HireDate { get; set; } = null;
        public DateTime? TerminationDate { get; set; } = null;
        public int? PriorWorkExperienceMonths { get; set; } = null;
    }
}
