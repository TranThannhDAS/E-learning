namespace backend.Dtos
{
    public class ExamDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public int TimeLimit { get; set; }
        public int MaxQuestion { get; set; }
        public bool Status { get; set; }
        public int SourceId { get; set; }
    }
}
