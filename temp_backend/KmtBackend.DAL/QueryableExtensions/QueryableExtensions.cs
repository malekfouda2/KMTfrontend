using KmtBackend.Models.DTOs.Common;

public static class QueryableExtensions
{
    public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> query, PaginationQuery pagination)
    {
        if (pagination is null) return query;

        int skip = (pagination.PageNumber - 1) * pagination.PageSize;
        return query.Skip(skip).Take(pagination.PageSize);
    }
}
