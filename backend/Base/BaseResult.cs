namespace backend.Base
{
    public class BaseResult
    {
        private static readonly Dictionary<int, string> DefaultMessages = new Dictionary<int, string>
        {
            { 400, "Bad Request" },
            { 401, "Unauthorized" },
            { 404, "Resource Not Found" },
            { 500, "Internal Server Error" },
            { 200, "SuccessFully" }
        };
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public BaseResult(int statusCode, string? message = null)
        {

            StatusCode = statusCode;
            Message = message ?? GetDefaultMessageForStatusCode(statusCode);
        }
        private string GetDefaultMessageForStatusCode(int statusCode)
        {
            if (DefaultMessages.TryGetValue(statusCode, out var defaultMessage))
            {
                return defaultMessage;
            }

            return "An error occurred.";
        }
    }
}
