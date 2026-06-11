using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace TeslaStore.DAL.Models
{
    public class UserProfileEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string IdentityUserId { get; set; } = string.Empty;

        public IdentityUser? User { get; set; }

        [StringLength(32)]
        public string? Phone { get; set; }
    }
}
