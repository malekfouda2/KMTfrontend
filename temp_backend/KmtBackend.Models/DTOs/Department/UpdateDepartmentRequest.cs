namespace KmtBackend.Models.DTOs.Department
{
    // Update department request
    public class UpdateDepartmentRequest
    {
        // Updated name (English)
        public string? Name { get; set; } = null!;

        // Updated name (Arabic)
        public string? NameAr { get; set; }

        // Updated description
        public string? Description { get; set; }
        public string? DescriptionAr { get; set; }
    }
}

