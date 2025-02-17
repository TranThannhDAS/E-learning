using backend.Base;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface IFavoriteService
    {
        Task<FavoriteSource> AddFavorite(int userId, int sourceId);
        Task<List<FavoriteSource>> GetAll();
        Task<(List<Source>,int)> GetSourcesFavoriteByUserId(int userId, int PageSize, int PageIndex);
        Task<List<Source>> GetTop5FavoriteSources();
        Task UnFavorite(int id);
    }
}
