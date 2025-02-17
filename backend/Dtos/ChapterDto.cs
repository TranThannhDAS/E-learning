namespace backend.Dtos
{
    public class ChapterDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int SourceId { get; set; }
    }
    public class ChapterDtoUpdate : ChapterDto
    {
        public int? Index { get; set; }
    }
}
