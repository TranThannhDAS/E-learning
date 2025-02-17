using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Chapter
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("title")]
        public string? Title { get; set; }
        [Column("Index")]
        public int Index { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("source_id")]
        public int SourceId { get; set; }
        public virtual Source? Source { get; set; }

        public ICollection<Lesson>? Lessions { get; set; }
        //public ICollection<Exam>? Exams { get; set; }
    }
}
