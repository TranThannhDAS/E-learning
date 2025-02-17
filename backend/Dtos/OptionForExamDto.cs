namespace backend.Dtos
{
    public class OptionForExamDto
    {
        public string? Answer { get; set; }
        public bool IsCorrect { get; set; }
        public int QuestionIndex { get; set; }
    }
}
