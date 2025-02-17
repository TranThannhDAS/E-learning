using backend.Dtos;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface IChapterService
    {
        Task<object> GetChapterBySourceID(int sourceID);
        Task<Chapter> CreateAsync(ChapterDtoUpdate chapter);
        Task<Chapter?> UpdateAsync(int id, ChapterDtoUpdate updatedItem);
        Task<List<Chapter>> GetAllAsync();
        Task<bool> DeleteAsync(int id);
    }
}
