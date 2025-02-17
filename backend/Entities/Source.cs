using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using backend.Dtos;

namespace backend.Entities
{
    public class Source
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("title")]
        public string? Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("thumbnail")]
        public string? Thumbnail { get; set; }

        [Column("slug")]
        public string? Slug { get; set; }

        [Column("status")]
        public bool Status { get; set; }

        [Column("benefit")]
        public string[]? Benefit { get; set; }

        [Column("requirement")]
        public string[]? Requirement { get; set; }

        [Column("video_intro")]
        public string? VideoIntro { get; set; }

        [Column("price")]
        public double Price { get; set; }

        [Column("rating")]
        public string? Rating { get; set; }


        //[Column("static_folder")]
        //[StringLength(20)]
        //public string? StaticFolder { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }
        public virtual User? User { get; set; }

        [Column("sub_topic_id")]
        public int? SubTopicId { get; set; }
        public virtual SubTopic? SubTopic { get; set; }


        public ICollection<Chapter>? Chapters { get; set; }
        public ICollection<Exam>? Exams { get; set; }
        public ICollection<FavoriteSource>? FavoriteSources { get; set; }
    }
    public class SourceWithTopicId
    {
        public SourceViewDto? Source { get; set; }
        public int? TopicId { get; set; }
        public string? TopicName { get; set; }   
    }
}
