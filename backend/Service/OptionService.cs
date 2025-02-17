using backend.Base;
using backend.Data;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;
using Nest;

namespace backend.Service
{
    public class OptionService : IOptionService
    {
        private readonly LMSContext _context;

        public OptionService(LMSContext context)
        {
            _context = context;
        }

        public async Task<Option> CreateAsync(Option option)
        {
            _context.Options.Add(option);
            await _context.SaveChangesAsync();
            return option;
        }

        public async Task<List<Option>> AddRange(List<Option> options)
        {
            await _context.Options.AddRangeAsync(options);
            await _context.SaveChangesAsync();
            return options;
        }

        public async Task<List<Option>> GetAllAsync()
        {
            return await _context.Options.ToListAsync();
        }

        public async Task<(List<Option>,int)> GetAllAsync(Pagination pagination)
        {
            var options = await _context.Options
                 //.Include(o => o.Question) // Includes the question to provide context for the option
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                 .Take(pagination.PageSize)
                .ToListAsync();
            var count = await _context.Options.CountAsync();
            return (options, count);    
        }

        public async Task<List<Option>> GetByQuestionId (int questionId)
        {
            return await _context.Options
            //.Include(o => o.Question) // Include the associated question for full context
                .Where(o => o.QuestionId == questionId).ToListAsync();
        }

        public async Task<Option?> GetByIdAsync(int id)
        {
            return await _context.Options
                //.Include(o => o.Question) // Include the associated question for full context
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Option?> UpdateAsync(int id, Option updatedOption)
        {
            var option = await _context.Options.FindAsync(id);
            if (option == null) return null;

            option.Answer = updatedOption.Answer;
            option.IsCorrect = updatedOption.IsCorrect;
            option.QuestionId = updatedOption.QuestionId;

            await _context.SaveChangesAsync();
            return option;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var option = await _context.Options.FindAsync(id);
            if (option == null) return false;

            _context.Options.Remove(option);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
