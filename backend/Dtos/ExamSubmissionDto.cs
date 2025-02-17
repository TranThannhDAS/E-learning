using backend.Entities;

namespace backend.Dtos
{
    public class ExamSubmissionDto
    {
        public int UserId { get; set; }
        public int ExamId { get; set; }
        public List<UserAnswer>? UserAnswers { get; set; } 
    }
}
