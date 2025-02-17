using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Exceptions;
using backend.Helper;
using backend.Service.Interface;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace backend.Service
{
    public class ExamService(LMSContext context, IHubContext<ExamHub> hubContext, ISerialService serialService, IServiceScopeFactory scopeFactory, IimageServices imageServices, IRedisService redisService, IQuestionService questionService, IAnswerService answerService, IQuizQuestionService quizQuestionService) : IExamService
    {
        private readonly LMSContext _context = context;
        private readonly IHubContext<ExamHub> _hubContext = hubContext;
        private readonly ISerialService _serialService = serialService;
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
        private readonly IimageServices _imageServices = imageServices;
        private readonly IRedisService _redisService = redisService;
        private readonly IQuestionService _questionService = questionService;
        private readonly IAnswerService _answerService = answerService;
        private readonly IQuizQuestionService _quizQuestionService = quizQuestionService;
        //private static volatile bool _continueExam = true;

        public async Task<Exam> CreateAsync(Exam exam)
        {
            await _context.Exams.AddAsync(exam);
            await _context.SaveChangesAsync();
            return exam;
        }

        public async Task<object> CreateQuestionsForExamAsync(QuestionForExamDto questionDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    Question question = new Question()
                    {
                        Content = questionDto.Question,
                        Image = questionDto.Image != null ? _imageServices.AddFile(questionDto.Image, "Questions", "Image") : null
                    };
                    await _context.Questions.AddAsync(question);
                    await _context.SaveChangesAsync();

                    List<Option> options = JsonConvert.DeserializeObject<List<Option>>(questionDto.Options.Trim());
                    options.ForEach(o => o.QuestionId = question.Id);
                    await _context.Options.AddRangeAsync(options);
                    await _context.SaveChangesAsync();

                    var optionIds = options.Select(o => new
                    {
                        o.Id,
                        o.Answer
                    }).ToList();
                    await transaction.CommitAsync();
                    return new
                    {
                        QuestionID = question.Id,
                        OptionIDs = optionIds
                    };
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }

        }
        public async Task<object> UpdateQuestionandOption(UpdateQuestionDto updateQuestionDto)
        {
            //using (var transaction = await _context.Database.BeginTransactionAsync())
            //{
            try
            {
                if (updateQuestionDto.QuestionId != 0)
                {
                    var question = await _context.Questions.FindAsync(updateQuestionDto.QuestionId);
                    if (updateQuestionDto.Content != null)
                    {
                        question.Content = updateQuestionDto.Content;
                    }
                    if (updateQuestionDto.Image != null)
                    {
                        question.Image = _imageServices.UpdateFile(updateQuestionDto.Image, question.Image, "Questions", "Image");
                    }
                    //await _context.SaveChangesAsync();
                    List<Option> options = new List<Option>();
                    if (updateQuestionDto.Options != null)
                    {
                        options = JsonConvert.DeserializeObject<List<Option>>(updateQuestionDto.Options);

                        _context.Options.UpdateRange(options);
                    }
                    var optionIds = options.Select(o => new
                    {
                        o.Id,
                        o.Answer
                    }).ToList();
                    await _context.SaveChangesAsync();

                    return new
                    {
                        QuestionID = question.Id,
                        OptionIDs = optionIds
                    };
                }
                else
                {
                    throw new Exception("questionid not found");
                }
            }
            catch (Exception)
            {
                //await transaction.RollbackAsync();
                throw;
            }
            //}
        }
        public async Task<object> ConnectExamWithQuestion(ConnectExamWithQuestion questions)
        {
            List<QuizQuestion> quizQuestions = new List<QuizQuestion>();
            foreach (var questionId in questions.QuestionId)
            {
                quizQuestions.Add(new QuizQuestion
                {
                    ExamId = questions.ExamID,
                    QuestionId = questionId
                });
            }
            await _context.AddRangeAsync(quizQuestions);
            await _context.SaveChangesAsync();
            return quizQuestions;
        }

        public async Task<List<ExamWithLessonId>> GetAllAsync()
        {
            var exams = await _context.Exams
                .Include(e => e.Serials)
                 //.Include(e => e.)
                 .Select(e => new ExamWithLessonId
                 {
                     Id = e.Id,
                     Title = e.Title,
                     TimeLimit = e.TimeLimit,
                     MaxQuestion = e.MaxQuestion,
                     Status = e.Status,
                     //IsStarted = e.IsStarted,
                     SourceId = e.SourceId,
                     LessonId = e.Serials.FirstOrDefault().LessonId,
                     ChapterId = _context.Lessons
                        .Where(l => l.Id == e.Serials.FirstOrDefault().LessonId)
                        .Select(l => l.ChapterId)
                        .FirstOrDefault()
                 })
                .ToListAsync();
            //foreach (var exam in exams)
            //{
            //    var lesson = await _context.Lessons.FindAsync(exam.LessonId);
            //    exam.ChapterId = lesson.ChapterId;
            //}
            return exams;
        }

        public async Task<(List<Exam>, int)> GetAllAsync(Pagination pagination)
        {
            var exams = await _context.Exams
                //.Include(e => e.Chapter) // Include the chapter details
                //.Include(e => e.QuizQuestions) // Include associated quiz questions
                //.Include(e => e.Answers) // Include associated answers
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();
            var count = await _context.Exams.CountAsync();
            return (exams, count);
        }

        public async Task<(dynamic, int)> GetDetailsExam(int examId)
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
            var serial = await _context.Serials.FirstOrDefaultAsync(s => s.ExamId == examId);
            //var chapterId = await _context.Lessons.Where(l => l.Id == serial.LessonId).Select(l => l.ChapterId).FirstOrDefaultAsync();
            if (examId == null) throw new NotFoundException($"exam not found with id : {examId} ");

            return (exam, (int)serial.LessonId);
        }


        public async Task<Exam?> GetByIdAsync(int id)
        {
            return await _context.Exams
                //.Include(e => e.Chapter)
                //.Include(e => e.QuizQuestions)
                //.Include(e => e.Answers)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Exam?> UpdateAsync(int id, Exam updatedExam)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return null;

            exam.Title = updatedExam.Title;
            exam.TimeLimit = updatedExam.TimeLimit;
            exam.MaxQuestion = updatedExam.MaxQuestion;
            exam.Status = updatedExam.Status;
            exam.SourceId = updatedExam.SourceId;
            //exam.ChapterId = updatedExam.ChapterId;
            //exam.StaticFolder = updatedExam.StaticFolder;

            await _context.SaveChangesAsync();
            return exam;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var exam = await _context.Exams.FindAsync(id);
                    if (exam == null) return false;

                    var quiz_questions = await _context.QuizQuestions.Where(q => q.ExamId == id).ToListAsync();
                    if (quiz_questions != null)
                    {
                        foreach (var quiz_question in quiz_questions)
                        {
                            await _questionService.DeleteAsync(quiz_question.QuestionId);
                            await _quizQuestionService.DeleteAsync(quiz_question.Id);
                        }
                        //_context.QuizQuestions.RemoveRange(quiz_questions);
                        //await _context.SaveChangesAsync();
                    }

                    var serials = await _context.Serials.FirstOrDefaultAsync(q => q.ExamId == id);
                    if (serials != null)
                    {
                        //foreach (var serial in serials)
                        //{
                        await _serialService.UpdateSerialDeleteExam(serials.Id);
                        //}
                        //_context.Serials.RemoveRange(serials);
                        //await _context.SaveChangesAsync();
                    }

                    var answers = await _context.Answers.Where(a => a.ExamId == id).ToListAsync();
                    if (answers != null)
                    {
                        foreach (var answer in answers)
                        {
                            await _answerService.DeleteAsync(answer.Id);
                        }
                        //_context.Answers.RemoveRange(answers);
                    }

                    _context.Exams.Remove(exam);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                    return true;
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    await transaction.RollbackAsync();
                    // Xử lý lỗi đồng thời ở đây, ví dụ: ghi log, thông báo cho người dùng, etc.
                    Console.WriteLine("Concurrency conflict occurred. Data may have been modified or deleted by another process.");
                    return false;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    // Xử lý các lỗi khác ở đây, ví dụ: ghi log, thông báo cho người dùng, etc.
                    Console.WriteLine($"An error occurred: {ex.Message}");
                    return false;
                }
            }
        }
        //public async Task StartExam(int examId)
        //{
        //    var exam = await _context.Exams.FindAsync(examId);
        //    if (exam == null || exam.IsStarted)
        //    {
        //        throw new Exception("Exam not found or already started.");
        //    }
        //    exam.IsStarted = true;
        //    await _context.SaveChangesAsync();
        //    await _hubContext.Clients.Group($"Exam-{examId}").SendAsync("ReceiveExamStart");

        //}


        public async Task<int> EndExam(
             //List<UserAnswer> userAnswers,
             int examId
            , int userId)
        {


            //_continueExam = false;
            var exam = await _context.Exams.FirstOrDefaultAsync(e => e.Id == examId);
            //var userConnection = await _context.UserConnections.OrderByDescending(x => x.ConnectedAt).FirstOrDefaultAsync(uc => uc.UserId == userId && uc.DisconnectedAt == null);
            var cacheKey = CreateCacheKey.BuildUserConnectionCacheKey(userId);
            var userConnectionJson = await _redisService.GetValueAsync(cacheKey);
            var userConnection = System.Text.Json.JsonSerializer.Deserialize<UserConnection>(userConnectionJson);
            if (exam == null || userConnection == null) throw new Exception("Exam or User not found");
            await _hubContext.Clients.Client(userConnection.ConnectionId).SendAsync("ReceiveExamEnd");
            //await _hubContext.Clients.Group($"Exam-{examId}").SendAsync("ReceiveExamEnd", "The exam has ended.");
            userConnection.DisconnectedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            if (userConnection.DisconnectedAt.HasValue)
            {
                var timeTaken = userConnection.DisconnectedAt.Value - userConnection.ConnectedAt;
                var formattedTakenTime = $"{timeTaken.Minutes:D2}:{timeTaken.Seconds:D2}";
                // Tìm giá trị Index lớn nhất hiện tại
                int? maxIndex = await _context.Attemps.MaxAsync(a => (int?)a.Index) ?? 0;
                Attemp attemp = new Attemp()
                {
                    Index = maxIndex + 1,
                    TimeTaken = formattedTakenTime,
                    UserId = userId
                };
                exam.IsStarted = false;
                await _context.Attemps.AddAsync(attemp);
                await _context.SaveChangesAsync();
                return attemp.Id;
            }
            else
            {
                // Xử lý trường hợp DisconnectedAt hoặc ConnectedAt không có giá trị
                throw new Exception("DisconnectedAt or ConnectedAt not found");
            }


        }

        //tính điểm theo % nếu mỗi câu hỏi có 1 đáp án đúng
        public async Task<(ExamAnswerDto,dynamic)> CalculateScore(List<UserAnswer> userAnswers, int examId)
        {

            // Lấy tất cả câu hỏi và câu trả lời đúng cho kỳ thi này
            var questions = await _context.QuizQuestions
                .Include(qq => qq.Question)
                    .ThenInclude(q => q.Options)
                .Where(qq => qq.ExamId == examId && qq.Question.Options.Any(o => o.IsCorrect))
                .ToListAsync();
            int totalQuestions = questions.Count;
            int correctAnswers = 0;
            // Kiểm tra từng câu trả lời của người dùng
            foreach (var userAnswer in userAnswers)
            {
                var correctOption = questions
                    .SelectMany(qq => qq.Question.Options)
                    .FirstOrDefault(o => o.QuestionId == userAnswer.QuestionId && o.IsCorrect);

                if (correctOption != null && correctOption.Id == userAnswer.OptionId)
                {
                    correctAnswers++; // Người dùng chọn đúng, tăng điểm
                }
            }
            //return 100;
            int incorrectAnswers = totalQuestions - correctAnswers;
            var score = (double)correctAnswers / totalQuestions * 100;
            var examAnswer = new ExamAnswerDto()
            {
                score = (int)score,
                correctAnswer = correctAnswers,
                inCorrectAnswer = incorrectAnswers
            };
            var examDetail = await GetDetails(examId);
            return (examAnswer, examDetail);
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

        //tính điểm nếu câu hỏi có nhiều đáp án đúng
        public async Task<int> CalculateScore1(List<UserAnswer> userAnswers, int examId)
        {
            var questions = await _context.QuizQuestions
                .Include(qq => qq.Question)
                    .ThenInclude(q => q.Options)
                .Where(qq => qq.ExamId == examId)
                .ToListAsync();

            int totalQuestions = questions.Count;
            int correctAnswers = 0;

            foreach (var question in questions)
            {
                var correctOptions = question.Question.Options.Where(o => o.IsCorrect).ToList();
                var userOptions = userAnswers.Where(ua => ua.QuestionId == question.QuestionId).Select(ua => ua.OptionId).ToList();

                if (correctOptions.All(co => userOptions.Contains(co.Id)) && userOptions.Count == correctOptions.Count)
                {
                    correctAnswers++;
                }
            }

            return (int)correctAnswers / totalQuestions * 100;
        }


    }

}
