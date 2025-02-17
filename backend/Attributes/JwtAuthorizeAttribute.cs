using backend.Filters;
using Microsoft.AspNetCore.Mvc;

namespace backend.Attributes
{
    public class JwtAuthorizeAttribute : TypeFilterAttribute
    {

        public JwtAuthorizeAttribute(
            params string[] roles
            )
            : base(typeof(JwtAuthorizeFilter))
        {
            Arguments = new object[] { roles };
        }
    }
}
