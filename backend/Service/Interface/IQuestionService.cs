using backend.Base;
using backend.Dtos;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface IQuestionService
    {
        Task<Question> CreateAsync(QuestionDto questionDto);
        Task<bool> DeleteAsync(int id);
        Task<List<QuestionViewModel>> GetAllAsync();
        Task<(List<QuestionViewModel>, int)> GetAllAsync(Pagination pagination);
        Task<QuestionViewModel?> GetByIdAsync(int id);
        Task<Question?> UpdateAsync(int id, QuestionDto updatedQuestion);
    }
}
