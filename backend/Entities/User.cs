using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Column("username")]
        [Required(ErrorMessage = "Username is required")]
        [StringLength(100, MinimumLength = 6,
            ErrorMessage = "Username must be between 6 and 100 characters")]
        public string? Username { get; set; }

        [Column("password")]
        [Required(ErrorMessage = "Password is required")]
        [StringLength(200, MinimumLength = 6,
            ErrorMessage = "Password must be between 6 and 200 characters")]
        public string? Password { get; set; }

        [Column("email")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string? Email { get; set; }

        [Column("phone_number")]
        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid phone number")]
        public string? PhoneNumber { get; set; }

        [Column("avatar")]
        public string? Avatar { get; set; }

        //[Column("static_folder")]
        //[StringLength(20)]
        //public string? StaticFolder { get; set; }

        [Column("role_id")]
        public int RoleId { get; set; }

        public ICollection<Source>? Sources { get; set; }
        public ICollection<Answer>? Answers { get; set; }  
        public ICollection<Attemp>? Attemps { get; set; }
        public ICollection<FavoriteSource>? FavoriteSources { get; set; }
    }
}
