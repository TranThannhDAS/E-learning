using backend.Base;
using backend.Data;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class TopicService(LMSContext context, IElasticSearchRepository elasticSearchRepository, ISubTopicService subTopicService) : ITopicService
    {
        private readonly LMSContext _context = context;
        private readonly IElasticSearchRepository _elasticSearchRepository = elasticSearchRepository;
        private readonly ISubTopicService _subTopicService = subTopicService;
        // Tạo mới một topic
        public async Task<Topic> CreateAsync(Topic topic)
        {
            var existtopic = _context.Topics.FirstOrDefault(t => t.TopicName == topic.TopicName);
            if (existtopic != null) throw new Exception("topic name is exist");
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();
            return topic;
        }
        public Task<List<Topic>> GetAllAsync()
        {
            return _context.Topics.ToListAsync();
        }

        // Lấy danh sách tất cả topics
        public async Task<(List<Topic>, int)> GetAllAsync(Pagination pagination)
        {
            var topics = await _context.Topics
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                .Take(pagination.PageSize)

                .ToListAsync();
            var count = await _context.Topics.CountAsync();
            return (topics, count);
        }

        // Lấy thông tin một topic theo ID
        public async Task<Topic?> GetByIdAsync(int id)
        {
            return await _context.Topics
                .Include(t => t.subTopics)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        // Cập nhật thông tin một topic
        public async Task<Topic?> UpdateAsync(int id, Topic updatedItem)
        {
            var topic = await _context.Topics.FindAsync(id);
            topic.TopicName = updatedItem.TopicName;
            await _context.SaveChangesAsync();
            return topic;
        }

        // Xóa một topic
        public async Task<bool> DeleteAsync(int id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null) return false;
            var sub_topic = await _context.SubTopics.Where(t => t.TopicId == id).ToListAsync();
            if (sub_topic != null)
            {
                foreach(var s in sub_topic)
                {
                    await _subTopicService.DeleteAsync(s.Id);
                }
                //_context.SubTopics.RemoveRange(sub_topic);
            }
            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
