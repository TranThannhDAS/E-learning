
namespace backend.Data
{
    public interface IRedisService
    {
        Task<string> GetValueAsync(string key);
        Task RemoveValueAsync(string key);
        Task SetValueAsync(string key, string value);
        Task SetValueWithExpiryAsync(string key, string value, TimeSpan expiry);

    }
}
