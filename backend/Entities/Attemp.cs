using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Attemp
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("index")]
        public int? Index { get; set; }

        [Column("time_taken")]
        public string? TimeTaken { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }
        public virtual User? User { get; set; }
        public virtual Answer? Answer { get; set; }
    }
}
