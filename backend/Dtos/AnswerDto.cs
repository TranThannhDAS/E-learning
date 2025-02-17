using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos
{
    public class AnswerDto
    {
        public int Id { get; set; }

        public string? Total { get; set; }

        public int? ExamId { get; set; }

        public int? UserId { get; set; }

        public int? AttemptId { get; set; }
        public int? CorrectAnswer { get; set; }
        public int? IncorrectAnswer { get; set; }
        public DateTime? CreateAt { get; set; }
    }
}
