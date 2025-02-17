using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class SubTopicService(LMSContext context, IElasticSearchRepository elasticsearchRepository, ISourceService sourceService) : ISubTopicService
    {
        private readonly LMSContext _context = context;
        private readonly IElasticSearchRepository _elasticsearchRepository = elasticsearchRepository;
        private readonly ISourceService _sourceService = sourceService;
        public async Task<SubTopic> CreateAsync(SubTopic subTopic)
        {
            _context.SubTopics.Add(subTopic);
            await _context.SaveChangesAsync();
            if (subTopic.Id != 0)
            {
                _elasticsearchRepository.UpdateScript(subTopic.TopicId.ToString(), u => u.Index("sources_index")
                .Script(s => s.Source("ctx._source.subTopics.add(params.subTopics)")
                .Params(p => p.Add("subTopics", new SubTopcElasticSearch
                {
                    SubTopicId = subTopic.Id,
                    SubTopicName = subTopic.SubTopicName,
                    sources = new List<SourcesElasticSearch>()
                }))));
            }

            return subTopic;
        }


        public Task<List<SubTopic>> GetAllAsync()
        {
            return _context.SubTopics.Include(st => st.Topic).ToListAsync();
        }
        public async Task<(List<SubTopic>, int)> GetAllAsync(Pagination pagination)
        {
            var stps = await _context.SubTopics.Include(st => st.Topic)
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                 .Take(pagination.PageSize)
                .ToListAsync();
            var count = await _context.SubTopics.CountAsync();
            return (stps, count);
        }

        public async Task<SubTopic?> GetByIdAsync(int id)
        {
            return await _context.SubTopics
                .FirstOrDefaultAsync(st => st.Id == id);
        }

        public async Task<SubTopic?> UpdateAsync(int id, SubTopic updatedSubTopic)
        {
            var subTopic = await _context.SubTopics.FindAsync(id);
            if (subTopic == null) return null;

            subTopic.SubTopicName = updatedSubTopic.SubTopicName;
            subTopic.TopicId = updatedSubTopic.TopicId;

            var affectedRecords = await _context.SaveChangesAsync();
            if (affectedRecords == 0) return null;

            // Cập nhật Elasticsearch
            var scriptSource = @"
        for (int i = 0; i < ctx._source.subTopics.size(); i++) {
            if (ctx._source.subTopics[i].SubTopicId == params.SubTopicId) {
                ctx._source.subTopics[i].SubTopicName = params.SubTopicName;
            }
        }";

            var scriptParams = new Dictionary<string, object>
    {
        { "SubTopicId", id },
        { "SubTopicName", updatedSubTopic.SubTopicName }
    };

            var updateResponse = _elasticsearchRepository.UpdateScript(updatedSubTopic.TopicId.ToString(), u => u
                .Index("sources_index")
                .Script(s => s
                    .Source(scriptSource)
                    .Params(scriptParams)
                )
            );

            return subTopic;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var subTopic = await _context.SubTopics.FindAsync(id);
            if (subTopic == null) return false;

            var sources = await _context.Sources.Where(s => s.SubTopicId == id).ToListAsync();
            if (sources != null && sources.Any())
            {
                foreach ( var source in sources)
                {
                    await _sourceService.DeleteAsync(source.Id);
                }
                //_context.Sources.RemoveRange(sources);
            }

            _context.SubTopics.Remove(subTopic);

            var affectedRecords = await _context.SaveChangesAsync();
            if (affectedRecords <= 0) return false;

            var script = "ctx._source.subTopics.removeIf(subTopic -> subTopic.SubTopicId == params.Id)";
            var updateSuccessful = _elasticsearchRepository.UpdateScript(subTopic.TopicId.ToString(), u => u.Index("sources_index")
                .Script(s => s.Source(script).Params(p => p.Add("Id", id))));

            return updateSuccessful;
        }

    }
}
