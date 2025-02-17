namespace backend.Data
{
    public static class CreateCacheKey
    {
        public static string BuildUserCacheKey(int userId) => $"buck-us{userId}";
        public static string BuildUserConnectionCacheKey(int userId) => $"connection-us{userId}";
        public static string CartKey = "cart_userid:{0}";
    }
}
