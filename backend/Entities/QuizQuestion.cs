using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class QuizQuestion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("exam_id")]
        public int ExamId { get; set; }

        [Column("question_id")]
        public int QuestionId { get; set; }

        public virtual Exam? Exam { get; set; }
        public virtual Question? Question { get; set; }
    }
}
