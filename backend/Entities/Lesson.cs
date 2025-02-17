using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Lesson
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("title")]
        public string? Title { get; set; }

        [Column("author")]
        public string? Author { get; set; }

        [Column("video_duration")]
        public string? VideoDuration { get; set; }

        [Column("thumbnail")]
        public string? Thumbnail { get; set; }

        [Column("video")]
        public string? Video { get; set; }

        //[Column("index")]
        //public int Index { get; set; }

        [Column("view")]
        public int View { get; set; }

        [Column("status")]
        public bool Status { get; set; }

        //[Column("static_folder")]
        //[StringLength(20)]
        //public string? StaticFolder { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("chapter_id")]
        public int ChapterId { get; set; }

        public virtual Chapter? Chapter { get; set; }
        public ICollection<Serial>? Serials { get; set; }
    }
}
