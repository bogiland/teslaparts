using System.ComponentModel.DataAnnotations;

namespace TeslaStore.Models
{
    public class RegisterModel
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(256)]
        public string? Email { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Password { get; set; } = string.Empty;
    }
}
