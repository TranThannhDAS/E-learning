using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Option
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("answer")]
        public string? Answer { get; set; }

        [Column("is_correct")]
        public bool IsCorrect { get; set; }

        [Column("question_id")]
        public int QuestionId { get; set; }
        public virtual Question? Question { get; set; }
    }
}
