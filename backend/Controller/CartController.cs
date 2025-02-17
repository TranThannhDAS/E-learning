using backend.Entities;
using backend.Service.Interface;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }
        [HttpPost("addCart")]
        public async Task<object> AddCart(Cart cart)
        {
            var result = await _cartService.AddCart(cart);
            return result;
        }
        [HttpGet("GetCart")]
        public async Task<object> GetCart(int userID)
        {
            var result = await _cartService.GetCartByUserId(userID);
            return result;
        }
        [HttpDelete("DeletCart")]
        public async Task<object> DeleteCart(int SourceID, int userid)
        {
            var result = await _cartService.DeleteCart(SourceID,userid);
            return result;
        }
    }
}
