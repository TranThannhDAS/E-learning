using backend.Base;
using backend.Dtos;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface IExamService
    {
        Task<int> EndExam(
            int examId, int userId);
        Task<(dynamic,int)> GetDetailsExam(int examId);
        //Task StartExam(int examId);
        Task<Exam> CreateAsync(Exam exam);
        Task<(List<Exam>, int)> GetAllAsync(Pagination pagination);
        Task<Exam?> GetByIdAsync(int id);
        Task<Exam?> UpdateAsync(int id, Exam updatedItem);
        Task<bool> DeleteAsync(int id);
        //Task<List<Exam>> GetAllAsync();
        Task<object> CreateQuestionsForExamAsync(QuestionForExamDto questionDto);
        Task<object> UpdateQuestionandOption(UpdateQuestionDto updateQuestionDto);
        Task<object> ConnectExamWithQuestion(ConnectExamWithQuestion questions);
        Task<List<ExamWithLessonId>> GetAllAsync();
        //Task<int> CalculateScore(List<UserAnswer> userAnswers, int examId);
        Task<(ExamAnswerDto, dynamic)> CalculateScore(List<UserAnswer> userAnswers, int examId);
    }
}
