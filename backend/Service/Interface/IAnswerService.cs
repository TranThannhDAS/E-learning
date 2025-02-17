using backend.Base;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface IAnswerService
    {
        Task<Answer> CreateAsync(Answer answer);
        Task<bool> DeleteAsync(int id);
        Task<object> GetAllAsync();
        Task<(List<Answer>, int)> GetAllAsync(Pagination pagination);
        Task<object> GetAllByUserIdAndExamId(int userId, int examId);
        Task<(Answer?, dynamic)> GetByIdAsync(int id);
        Task<Answer?> UpdateAsync(int id, Answer updatedAnswer);
    }
}
