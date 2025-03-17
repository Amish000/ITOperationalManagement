using System.ComponentModel.DataAnnotations;
namespace ITAdministrationApp.Areas.Admin.ViewModels
{
    public class UserPasswordChangeViewModel
    {
        [Required]
        public string userId { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
