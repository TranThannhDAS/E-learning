using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class UserConnection
    {
        [Key]
        public string ConnectionId { get; set; } = string.Empty;
        public int UserId { get; set; }
        public DateTime ConnectedAt { get; set; }
        public DateTime? DisconnectedAt { get; set; }
        public DateTime EndTime { get; set; }
        public int? ExamId { get; set; }
        public virtual Exam? Exam { get; set; }

        public virtual User? User { get; set; }
    }
}
