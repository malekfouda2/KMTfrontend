namespace KmtBackend.API.DTOs.Department
{
    // Create department request
    public class CreateDepartmentRequest
    {
        // Department name (English)
        public string Name { get; set; } = null!;
        
        // Department name (Arabic)
        public string? NameAr { get; set; }
        
        // Optional description
        public string? Description { get; set; }
        public string? DescriptionAr { get; set; }
    }
}

