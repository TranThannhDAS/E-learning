using backend.Dtos;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface ICartService
    {
        Task<object> AddCart(Cart cart);
        Task<object> DeleteCart(int SourceID, int userid);
        Task<List<CartDto>> GetCartByUserId(int id);
        Task<List<Cart>> GetCartListByKey(string key);
        Task DeleteAllCart(int userid);

    }
}
 