namespace backend.Dtos
{
    public class LessonDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? VideoDuration { get; set; }
        public int View { get; set; }
        public bool Status { get; set; }
        public int ChapterId { get; set; }
        public string? FileVideoNameSource { get; set; }
        public string? Description { get; set; }
    }
    public class LessonDtoCreate : LessonDto
    {
        public int? Index { get; set; }
        public int? Exam_ID { get; set; }
    }
    public class LessonDtoUpdate : LessonDto
    {
        public SerialDtoUpdate serialDto { get; set; }
    }
    public class LessonDtoDetail : LessonDto
    {
        public string? Video {  get; set; }
        public int? ExamId { get; set; }
    }
}
