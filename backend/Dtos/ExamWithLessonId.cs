namespace backend.Dtos
{
    public class ExamWithLessonId
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public int TimeLimit { get; set; }
        public int MaxQuestion { get; set; }
        public bool Status { get; set; }
        //public bool IsStarted { get; set; }
        public int SourceId { get; set; }
        public int? ChapterId { get; set; }
        public int? LessonId { get; set; }
    }
}
