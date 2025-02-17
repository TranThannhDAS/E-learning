using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestRedisController : ControllerBase
    {
        private readonly IRedisService _redisService;

        public TestRedisController(IRedisService redisService)
        {
            _redisService = redisService;
        }
        [HttpPost("create")]        
        
        public async Task Create (string key, string value)
        {
            await _redisService.SetValueAsync(key, value);
        }

        [HttpGet]
        public async Task<string> Get (string key)
        {
            return await _redisService.GetValueAsync(key);
        }
    }
}
