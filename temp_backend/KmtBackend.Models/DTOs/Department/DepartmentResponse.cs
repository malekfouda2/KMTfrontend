namespace KmtBackend.Models.DTOs.Department
{
    public class DepartmentResponse
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;
        public string NameAr { get; set; } = null!;

        public string Description { get; set; } = null!;
        public string DescriptionAr { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int UserCount { get; set; }
    }
}

