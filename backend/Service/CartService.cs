using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Newtonsoft.Json;

namespace backend.Service
{
    public class CartService : ICartService
    {
        private readonly IRedisService _redisService;
        public CartService(IRedisService redisService)
        {
            _redisService = redisService;
        }
        public async Task<object> AddCart(Cart cart)
        {
            string key = string.Format(CreateCacheKey.CartKey, cart.Userid);
            var listCart = await GetCartListByKey(key);
            if(listCart != null)
            {
                var test = listCart.Where(p => p.SourceId == cart.SourceId).FirstOrDefault();
                if (test != null)
                {
                    return new
                    {
                        mess = "Đã có trong giỏ hàng",
                        code = 400
                    };
                }
            }
            try
            {
                listCart.Add(cart);
                var test = JsonConvert.SerializeObject(listCart);

                await SetCartListWithExpiry(key, listCart);
            }
            catch (Exception ex)
            {
                // Log exception or handle it appropriately
                Console.WriteLine($"Error adding cart: {ex.Message}");
                throw;
            }

            return new
            {
                mess = "Thêm thành công",
                code = 200
            };
        }

        public async Task DeleteAllCart(int userid)
        {
            string key = string.Format(CreateCacheKey.CartKey, userid);

            await _redisService.RemoveValueAsync(key);
        }

        public async Task<object> DeleteCart(int SourceID, int userID)
        {
            string key = string.Format(CreateCacheKey.CartKey, userID);
            var listCart = await GetCartListByKey(key);
            var itemToRemove = listCart.FirstOrDefault(p => p.SourceId == SourceID);
            if (itemToRemove == null)
            {
                return new { success = false, message = "SourceID không tồn tại trong giỏ hàng." };
            }
            listCart.RemoveAll(p => p.SourceId == SourceID);
            await SetCartListWithExpiry(key, listCart);
            return new { success = true, SourceID = SourceID };
        }

        public async Task<List<CartDto>> GetCartByUserId(int id)
        {
            string key = string.Format(CreateCacheKey.CartKey, id);
            var response = await GetCartListByKey(key);
            var result = response.GroupBy(p => new { p.username, p.Userid, p.email }).Select(s => new CartDto
            {
                Username = s.Key.username ?? "dat1234",
                Userid = s.Key.Userid == null ? 3 : (int)s.Key.Userid,
                Email = s.Key.email ?? "dat123@gmail.com",
                TotalPrice = s.Sum(p => p.Price) == null ? 10000 : (double)s.Sum(p => p.Price),
                Sources = s.Select(p => new SourceCart
                {
                    Thumbnail = p.thumbnail ?? "https://www.invert.vn/media/uploads/uploads/2022/12/03193534-2-anh-gai-xinh-diu-dang.jpeg",
                    SourceName = p.SourceName ?? "" ,
                    SourceID = p.SourceId == null ? 10 : (int)p.SourceId,
                    Price = p.Price == null ? 30000 : (double)p.Price    
                }).ToList()
            }).ToList();
            return result; 
        }

        public async Task<List<Cart>> GetCartListByKey(string key)
        {
            string data = await _redisService.GetValueAsync(key);
            return string.IsNullOrEmpty(data) ? new List<Cart>() : JsonConvert.DeserializeObject<List<Cart>>(data);
        }

        private async Task SetCartListWithExpiry(string key, List<Cart> listCart)
        {
            await _redisService.SetValueWithExpiryAsync(key, JsonConvert.SerializeObject(listCart), TimeSpan.FromDays(12));
        }
    }
}
