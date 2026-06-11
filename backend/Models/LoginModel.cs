using System.ComponentModel.DataAnnotations;

namespace TeslaStore.Models
{
    public class LoginModel
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Password { get; set; } = string.Empty;
    }
}
