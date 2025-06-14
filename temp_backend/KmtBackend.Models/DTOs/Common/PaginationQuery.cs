namespace KmtBackend.Models.DTOs.Common
{
    public class PaginationQuery
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public void Normalize()
        {
            PageNumber = PageNumber < 1 ? 1 : PageNumber;
            PageSize = PageSize > 100 ? 100 : PageSize;
        }
    }
}
