using System.Globalization;

namespace KmtBackend.API.Middlewares
{
    public class LocalizationMiddleware
    {
        private readonly RequestDelegate _next;
        
        public LocalizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        
        public async Task InvokeAsync(HttpContext context)
        {
            var language = context.Request.Headers["Accept-Language"].ToString();
            
            if (string.IsNullOrWhiteSpace(language))
            {
                await _next(context);
                return;
            }
            
            if (language.Contains("ar"))
            {
                var arabicCulture = new CultureInfo("ar-SA");
                CultureInfo.CurrentCulture = arabicCulture;
                CultureInfo.CurrentUICulture = arabicCulture;
            }
            else
            {
                var englishCulture = new CultureInfo("en-US");
                CultureInfo.CurrentCulture = englishCulture;
                CultureInfo.CurrentUICulture = englishCulture;
            }
            
            await _next(context);
        }
    }
}
