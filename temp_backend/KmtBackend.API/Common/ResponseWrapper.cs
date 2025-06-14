namespace KmtBackend.API.Common
{
    public class ResponseWrapper<T>
    {
        public T? Data { get; set; }
        public required string Message { get; set; }
        public bool Success { get; set; }
        public List<string>? Errors { get; set; }


        // Optional pagination fields
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int? TotalRecords { get; set; }
    }
}
