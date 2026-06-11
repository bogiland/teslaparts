using System.ComponentModel.DataAnnotations;

namespace TeslaStore.Models
{
    public class AssignRoleModel
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Role { get; set; } = string.Empty;
    }
}
