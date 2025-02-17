using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Topic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("topic_name")]
        [Required(ErrorMessage = "Topic Name is required")]
        public string? TopicName { get; set; }
        public ICollection<SubTopic>? subTopics { get; set; }
    }
}
