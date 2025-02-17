using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.UserDto
{
    public class UserUpdateDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid phone number")]
        public string? PhoneNumber { get; set; }

        public IFormFile? Avatar { get; set; }
    }
}
