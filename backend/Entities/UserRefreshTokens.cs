using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class UserRefreshTokens
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string? UserName { get; set; }

        [Required(ErrorMessage = "Refresh token is required")]
        public string? RefreshToken { get; set; }

        [Required(ErrorMessage = "RefreshTokenExpiryTime is required")]
        public DateTime RefreshTokenExpiryTime { get; set; }

        public bool IsActived { get; set; } = true;
    }
}
