using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.UserDto
{
    public class UserViewModel
    {
        public string? Username { get; set; }

        public string? Password { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Avatar { get; set; }
    }
}
