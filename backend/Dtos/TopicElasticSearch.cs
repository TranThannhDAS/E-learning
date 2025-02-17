using backend.Entities;
using Nest;

namespace backend.Dtos
{
    public class TopicElasticSearch
    {
        [PropertyName("TopicId")]
        public int TopicId { get; set; }
        [PropertyName("TopicName")]
        public string TopicName { get; set; }
        public List<SubTopcElasticSearch> subTopics { get; set; }
    }
    public class SubTopcElasticSearch
    {
        [PropertyName("SubTopicId")]
        public int SubTopicId { get; set; }
        [PropertyName("SubTopicName")]
        public required string SubTopicName { get; set; }
        public List<SourcesElasticSearch>? sources { get; set; }
    }
    public class SourcesElasticSearch
    {
        [PropertyName("Id")]
        public int Id { get; set; }
        [PropertyName("Title")]
        public string Title { get; set; } = "";
        [PropertyName("Description")]
        public string Description { get; set; } = "";
        [PropertyName("Thumbnail")]
        public string Thumbnail { get; set; } = "";
        [PropertyName("Slug")]
        public string Slug { get; set; } = "";
        [PropertyName("Status")]
        public int? Status { get; set; }
        [PropertyName("Benefit")]
        public string? Benefit { get; set; } = "abc";
        [PropertyName("Video_intro")]
        public string Video_intro { get; set; } = "";
        [PropertyName("Price")]
        public double? Price { get; set; }
        [PropertyName("Rating")]
        public string Rating { get; set; } = "";
        [PropertyName("UserId")]
        public int UserId { get; set; }
    }
    public class OnlySources
    {
        [PropertyName("Id")]
        public int Id { get; set; }
        [PropertyName("Title")]
        public CompletionField Title { get; set; }
        [PropertyName("Description")]
        public string Description { get; set; }
        [PropertyName("Thumbnail")]
        public string Thumbnail { get; set; }
        [PropertyName("Slug")]
        public string Slug { get; set; }
        [PropertyName("Status")]
        public int? Status { get; set; }
        [PropertyName("Benefit")]
        public string? Benefit { get; set; }
        [PropertyName("Video_intro")]
        public string Video_intro { get; set; }
        [PropertyName("Price")]
        public double? Price { get; set; }
        [PropertyName("Rating")]
        public int Rating { get; set; }
        [PropertyName("UserId")]
        public int UserId { get; set; }
        [PropertyName("TopicId")]
        public int TopicId { get; set; }
        [PropertyName("TopicName")]
        public string TopicName { get; set; }
        [PropertyName("SubTopicId")]
        public int SubTopicId { get; set; }
        [PropertyName("SubTopicName")]
        public string SubTopicName { get; set; }
    }

}
