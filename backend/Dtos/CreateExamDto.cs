namespace backend.Dtos
{
    public class CreateExamDto
    {
        public string? Title { get; set; }
        public int TimeLimit { get; set; }
        public int MaxQuestion { get; set; }
        public bool Status { get; set; }
        public int SourceId { get; set; }
    }
}
