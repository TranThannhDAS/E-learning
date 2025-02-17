using backend.Base;
using backend.Data;
using backend.Entities;
using backend.Exceptions;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class AnswerService : IAnswerService
    {
        private readonly LMSContext _context;

        public AnswerService(LMSContext context)
        {
            _context = context;
        }

        public async Task<Answer> CreateAsync(Answer answer)
        {
            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();
            return answer;
        }

        public async Task<(List<Answer>, int)> GetAllAsync(Pagination pagination)
        {
            var answers = await _context.Answers
                //.Include(a => a.Exam)
                //.Include(a => a.User)
                //.Include(a => a.Attemp)
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();
            var count = await _context.Answers.CountAsync();
            return (answers, count);
        }

        public async Task<(Answer?,dynamic)> GetByIdAsync(int id)
        {
            var answer = await _context.Answers
                //.Include(a => a.Exam)
                //.Include(a => a.User)
                //.Include(a => a.Attemp)
                .FirstOrDefaultAsync(a => a.Id == id);
            var detailExam = await GetDetails((int)answer.ExamId);
            return (answer, detailExam);
        }

        public async Task<Answer?> UpdateAsync(int id, Answer updatedAnswer)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null) return null;

            answer.Total = updatedAnswer.Total;
            answer.ExamId = updatedAnswer.ExamId;
            answer.UserId = updatedAnswer.UserId;
            answer.AttemptId = updatedAnswer.AttemptId;

            await _context.SaveChangesAsync();
            return answer;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null) return false;

            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> GetAllAsync()
        {
            var query = from answer in _context.Answers
                        join attemp in _context.Attemps
                        on answer.AttemptId equals attemp.Id
                        select new
                        {
                            AnswerId = answer.Id,
                            Total = answer.Total,
                            ExamId = answer.ExamId,
                            UserId = answer.UserId,
                            AttemptId = answer.AttemptId,
                            CorrectAnswer = answer.CorrectAnswer,
                            IncorrectAnswer = answer.IncorrectAnswer,
                            CreateAt = answer.CreateAt
                            //Index = attemp.Index,
                            //TimeTaken = attemp.TimeTaken
                        };

            var result = await query.ToListAsync();

            var finalResult = new List<object>();

            foreach (var item in result)
            {
                var examDetails = await GetDetails((int)item.ExamId);

                finalResult.Add(new
                {
                    item.AnswerId,
                    item.Total,
                    item.ExamId,
                    item.UserId,
                    item.AttemptId,
                    item.CorrectAnswer,
                    item.IncorrectAnswer,
                    item.CreateAt,
                    // Index = item.Index,
                    // TimeTaken = item.TimeTaken,
                    Exam = examDetails
                });
            }

            return finalResult;
        }
        public async Task<object> GetAllByUserIdAndExamId(int userId, int examId)
        {

            var result = await (from answer in _context.Answers
                                join attemp in _context.Attemps
                                on answer.AttemptId equals attemp.Id
                                where answer.UserId == userId && answer.ExamId == examId
                                orderby attemp.Index
                                select new 
                                {
                                    AnswerId = answer.Id,
                                    Total = answer.Total,
                                    ExamId = answer.ExamId,
                                    UserId = answer.UserId,
                                    AttemptId = answer.AttemptId,
                                    Index = attemp.Index,
                                    TimeTaken = attemp.TimeTaken
                                }).ToListAsync();

            return result;

        }
        private async Task<dynamic> GetDetails(int examId)
        {
            var exam = await _context.Exams
                .Include(e => e.Serials)
                .Where(e => e.Id == examId)
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.TimeLimit,
                    e.Serials.FirstOrDefault().Index,
                    LessonId = e.Serials.FirstOrDefault().LessonId,
                    ChapterId = _context.Lessons
                            .Where(l => l.Id == e.Serials.FirstOrDefault().LessonId)
                            .Select(l => l.ChapterId)
                            .FirstOrDefault(),
                    Questions = e.QuizQuestions.Select(qq => new
                    {
                        QuestionID = qq.QuestionId,
                        QuestionText = qq.Question.Content,
                        Options = qq.Question.Options.Select(o => new { o.Id, o.Answer, o.IsCorrect })
                    })
                })
                .FirstOrDefaultAsync();

            if (exam == null) throw new NotFoundException($"exam not found with id : {examId} ");

            return (exam);
        }
    }

}
