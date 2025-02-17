using backend.Base;
using backend.Data;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class QuizQuestionService : IQuizQuestionService
    {
        private readonly LMSContext _context;

        public QuizQuestionService(LMSContext context)
        {
            _context = context;
        }

        public async Task<QuizQuestion> CreateAsync(QuizQuestion quizQuestion)
        {
            _context.QuizQuestions.Add(quizQuestion);
            await _context.SaveChangesAsync();
            return quizQuestion;
        }

        public Task<List<QuizQuestion>> GetAllAsync()
        {
            return _context.QuizQuestions.ToListAsync();
        }

        public async Task<(List<QuizQuestion>,int)> GetAllAsync(Pagination pagination)
        {
            var qqs = await _context.QuizQuestions
                 //.Include(qq => qq.Exam)
                 //.Include(qq => qq.Question)
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                 .Take(pagination.PageSize)
                .ToListAsync();
            var count = await _context.QuizQuestions.CountAsync();
            return (qqs, count);
        }

        public async Task<QuizQuestion?> GetByIdAsync(int id)
        {
            return await _context.QuizQuestions
                //.Include(qq => qq.Exam)
                //.Include(qq => qq.Question)
                .FirstOrDefaultAsync(qq => qq.Id == id);
        }

        public async Task<QuizQuestion?> UpdateAsync(int id, QuizQuestion updatedQuizQuestion)
        {
            var quizQuestion = await _context.QuizQuestions.FindAsync(id);
            if (quizQuestion == null) return null;

            quizQuestion.ExamId = updatedQuizQuestion.ExamId;
            quizQuestion.QuestionId = updatedQuizQuestion.QuestionId;

            await _context.SaveChangesAsync();
            return quizQuestion;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var quizQuestion = await _context.QuizQuestions.FindAsync(id);
            if (quizQuestion == null) return false;

            _context.QuizQuestions.Remove(quizQuestion);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
