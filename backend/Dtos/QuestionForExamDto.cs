namespace backend.Dtos
{
    public class QuestionForExamDto
    {
        public int ExamId { get; set; }
        public string Question { get; set; }
        public IFormFile? Image { get; set; }
        public string Options { get; set; }
    }
    public class UpdateQuestionDto
    {
        public int QuestionId { get; set; } = 0;
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
        public string? Options { get; set; }
    }
    public class ConnectExamWithQuestion
    {
        public int ExamID { get; set; }
        public int[] QuestionId { get; set; }
    }
}
