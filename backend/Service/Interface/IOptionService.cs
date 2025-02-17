using backend.Entities;

namespace backend.Service.Interface
{
    public interface IOptionService : IService<Option>
    {
        Task<List<Option>> GetByQuestionId(int questionId);
    }
}
