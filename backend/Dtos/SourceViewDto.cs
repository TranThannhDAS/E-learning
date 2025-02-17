namespace backend.Dtos
{
    public class SourceViewDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Thumbnail { get; set; }
        public string? Slug { get; set; }
        public int? Status { get; set; }
        public string[]? Benefit { get; set; }
        public string[]? Requirement { get; set; }
        public string? VideoIntro { get; set; }
        public double? Price { get; set; }
        public string? Rating { get; set; }
        public int? UserId { get; set; }
        public int? SubTopicId { get; set; }

        public int? TopicId { get; set; }
        public string SubTopicName { get; set; }
        public string TopicName { get; set; }
    }
}
