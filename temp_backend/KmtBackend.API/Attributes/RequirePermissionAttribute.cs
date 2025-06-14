using Microsoft.AspNetCore.Authorization;
using System;

namespace KmtBackend.API.Attributes
{
    /// <summary>
    /// Custom authorization attribute to require specific permission
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class RequirePermissionAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// Create a permission requirement
        /// </summary>
        /// <param name="permission">Permission code in format "resource.action"</param>
        public RequirePermissionAttribute(string permission)
        {
            // Use policy naming convention to identify the permission
            Policy = $"Permission:{permission}";
        }
    }
}
