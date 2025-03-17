using System.ComponentModel.DataAnnotations;

namespace ITAdministrationApp.Areas.Client.ViewModels
{
    public class ChangePasswordVM
    {
        [Required]
        public string currentPassword { get; set; }

        public string newPassword { get; set; }

        [Compare("newPassword")]
        public string confirmPassword { get; set; }
    }
}
