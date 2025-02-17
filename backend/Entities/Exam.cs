using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Exam
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("title")]
        public string? Title { get; set; }

        [Column("time_limit")]
        public int TimeLimit { get; set; }

        [Column("max_question")]
        public int MaxQuestion { get; set; }

        /// <summary>
        /// bài ktra đã hoàn thành chưa
        /// </summary>

        [Column("status")]
        public bool Status { get; set; }

        /// <summary>
        /// ktra xem đã bắt đầu thi chưa để xác định trong 1 tg chỉ có 1 bài thi của 1 user dc bắt đầu
        /// </summary>
        [Column("is_started")]
        public bool IsStarted { get; set; } = false;


        //[Column("static_folder")]
        //[StringLength(20)]
        //public string? StaticFolder { get; set; }

        [Column("source_id")]
        public int SourceId { get; set; }
        //[Column("chapter_id")]
        //public int? ChapterId { get; set; }

        //public virtual Chapter? Chapter { get; set; }
        public virtual Source? Source { get; set; }
        public ICollection<QuizQuestion>? QuizQuestions { get; set; }
        public ICollection<Answer>? Answers { get; set; }
        public ICollection<Serial>? Serials { get; set; }
        public ICollection<UserConnection>? Users { get; set; }
        
    }
}
