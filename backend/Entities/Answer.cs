using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Answer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [ForeignKey("Attemps")]
        [Column("id")]
        public int Id { get; set; }

        [Column("total")]
        public string? Total { get; set; }

        [Column("exam_id")]
        public int? ExamId { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("attempt_id")]
        public int? AttemptId { get; set; }
        [Column("correct_answer")]
        public int? CorrectAnswer {  get; set; }
        [Column("incorrect_answer")]
        public int? IncorrectAnswer { get; set; }
        [Column("create_at")]
        public DateTime? CreateAt { get; set; }

        public virtual Exam? Exam { get; set; }
        public virtual User? User { get; set; }
        public virtual Attemp? Attemp { get; set; }
    }
}
