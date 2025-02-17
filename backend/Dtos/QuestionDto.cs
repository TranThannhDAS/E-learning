namespace backend.Dtos
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
    }
}
