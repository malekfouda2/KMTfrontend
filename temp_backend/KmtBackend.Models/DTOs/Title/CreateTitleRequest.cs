namespace KmtBackend.Models.DTOs.Title
{
    public class CreateTitleRequest
    {
        public string Name { get; set; } = null!;

        public string NameAr { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string DescriptionAr { get; set; } = null!;
    }
}

