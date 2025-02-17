using backend.Base;
using backend.Dtos;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface ISourceService
    {
        Task<Source> CreateAsync(SourceDto sourceDto);
        Task<bool> DeleteAsync(int id);
        Task<List<SourceWithTopicId>> GetAllAsync();
        Task<(List<SourceWithTopicId>, int)> GetAllAsync(Pagination pagination);
        Task<SourceViewDto?> GetByIdAsync(int id);
        Task<Source?> UpdateAsync(int id, SourceDto updatedSource);
        Task<object> GroupByTopic();
        Task<bool> SourceCheckOrder(int userId, int sourceId);
    }
}
