using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class SubTopic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("sub_topic_name")]
        public string? SubTopicName { get; set; }

        [Column("topic_id")]
        public int? TopicId { get; set; }
        public virtual Topic? Topic { get; set; }

        public ICollection<Source>? Sources { get; set; }
    }
}
