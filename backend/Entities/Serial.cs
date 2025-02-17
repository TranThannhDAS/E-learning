using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class Serial
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Column("index")]
        public int? Index { get; set; }
        [Column("lesson_id")]
        public int? LessonId { get; set; }
        [Column("exam_id")]
        public int? ExamId { get; set; }
        public virtual Lesson? Lesson { get; }
        public virtual Exam? Exam { get; }
    }
}
