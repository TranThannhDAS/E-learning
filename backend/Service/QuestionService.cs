using AutoMapper;
using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class QuestionService : IQuestionService
    {
        private readonly LMSContext _context;
        private readonly IMapper _mapper;
        private readonly IimageServices _imageServices;
        private readonly IOptionService _optionService;
        public QuestionService(LMSContext context, IMapper mapper, IimageServices imageServices, IOptionService optionService)
        {
            _context = context;
            _mapper = mapper;
            _imageServices = imageServices;
            _optionService = optionService;
        }

        public async Task<Question> CreateAsync(QuestionDto questionDto)
        {

            if (questionDto.Image != null && !_imageServices.IsImage(questionDto.Image))
            {
                throw new Exception("Invalid image format. Only JPG, JPEG, PNG, and GIF are allowed.");
            }
            var question = new Question
            {
                Content = questionDto.Content,
                Image = questionDto.Image != null ? _imageServices.AddFile(questionDto.Image, "Questions", "Image") : null
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<List<Question>> AddRange(List<QuestionDto> questionDtos)
        {
            List<Question> result = [];
            foreach (var questionDto in questionDtos)
            {
                var question = new Question
                {
                    Content = questionDto.Content,
                    Image = questionDto.Image != null ? _imageServices.AddFile(questionDto.Image, "Questions", "Image") : null
                };
                result.Add(question);
            }
            await _context.Questions.AddRangeAsync(result);
            await _context.SaveChangesAsync();
            return result;
        }

        

        public async Task<List<QuestionViewModel>> GetAllAsync()
        {
            var questions = await _context.Questions
                //.Include(q => q.QuizQuestions) // Include quiz questions associated with the question
                //.Include(q => q.Options) // Include options for the question
                .Select(q => new Question
                {
                    Content = q.Content,
                    Image = q.Image != null ? _imageServices.GetFile(q.Image) : null,
                })
                .ToListAsync();
            return _mapper.Map<List<QuestionViewModel>>(questions);
        }
        public async Task<(List<QuestionViewModel>, int)> GetAllAsync(Pagination pagination)
        {
            var questions = await _context.Questions
                 //.Include(q => q.QuizQuestions) // Include quiz questions associated with the question
                 //.Include(q => q.Options) // Include options for the question
                 .Select(q => new Question
                 {
                     Content = q.Content,
                     Image = q.Image != null ? _imageServices.GetFile(q.Image) : null,
                 })
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                 .Take(pagination.PageSize)
                .ToListAsync();
            var count = await _context.Questions.CountAsync();
            return (_mapper.Map<List<QuestionViewModel>>(questions), count);
        }
        public async Task<QuestionViewModel?> GetByIdAsync(int id)
        {
            var qt = await _context.Questions
                //.Include(q => q.QuizQuestions)
                //.Include(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id);
            qt.Image = qt.Image != null ? _imageServices.GetFile(qt.Image) : null;
            return _mapper.Map<QuestionViewModel?>(qt);
        }

        public async Task<Question?> UpdateAsync(int id, QuestionDto updatedQuestion)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return null;

            question.Content = updatedQuestion.Content;
            question.Image = _imageServices.UpdateFile(updatedQuestion.Image, question.Image, "Questions", "Image");
            //question.StaticFolder = updatedQuestion.StaticFolder;
            // Ensure options and quiz questions are handled if necessary, might require additional logic

            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return false;
            var quiz_question = await _context.QuizQuestions.Where(q => q.QuestionId == id).ToListAsync();
            if (quiz_question != null)
            {
                _context.QuizQuestions.RemoveRange(quiz_question);
            }

            var options = await _context.Options.Where(a => a.QuestionId == id).ToListAsync();
            if (options != null)
            {
                foreach (var option in options)
                {
                    await _optionService.DeleteAsync(option.Id);
                }
                //_context.Options.RemoveRange(options);
            }
            if (question.Image != null)
            {
                _imageServices.DeleteFile(question.Image);
            }
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
