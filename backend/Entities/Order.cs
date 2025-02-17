using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }
        [Column("UserID")]
        public int UserID { get; set; }
        public User? User { get; set; }
        [Column("SouresID")]
        public int SouresID { get; set; }
        public Source? Soures { get; set; }
        [Column("TotalPrice")]
        public double TotalPrice { get; set; }
        [Column("Status")]
        public bool Status { get; set; }
        [Column("PaymentID")]
        public string PaymentID { get; set; }
        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
