using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class FavoriteSource
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Column("source_id")]
        public int SourceId { get; set;}
        [Column("user_id")]
        public int UserId { get; set;}
        [Column("is_favorite")]
        public bool IsFavorite { get; set;}
        public virtual Source? Source { get; set;}
        public virtual User? User { get; set;}  
    }
}
