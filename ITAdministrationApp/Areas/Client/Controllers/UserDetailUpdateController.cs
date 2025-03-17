using System.Security.Claims;
using ITAdministrationApp.Areas.Client.ViewModels;
using ITAdministrationApp.Controllers;
using ITAdministrationApp.Data;
using ITAdministrationApp.Helpers;
using ITAdministrationApp.Models;
using ITAdministrationApp.Services;
using ITAdministrationApp.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using NuGet.Common;


namespace ITAdministrationApp.Areas.Client.Controllers
{
    [Authorize]  // Default authorization for all actions
    [Area("Client")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class UsersDetailUpdateController : ApiControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        //private readonly ILogger _logger;
        private readonly IJwtService _jwtService;
        protected virtual CancellationToken CancellationToken => CancellationToken.None;
        public UsersDetailUpdateController(
            UserManager<ApplicationUser> userManager,
            //ILogger logger, 
            SignInManager<ApplicationUser> signInManager,
            IJwtService jwtService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            //_logger = logger;
            _jwtService = jwtService;
        }
        [HttpGet("GetUsersData")]
        public async Task<IActionResult> GetUserDetail()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return ApiError("User not found");
            }
            var userDetail = new UserDetailViewModel()
            {
                userName = user.UserName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,

            };
            return ApiResponse(
                new
                {
                    userDetail
                }, "User Detail retrieved Successfully");
        }

        [HttpPut("UpdatePhoneNumber")]
        public async Task<IActionResult> UpdatePhoneNumber([FromBody] UpdatePhoneNumberVM updateNumber)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId);

                var Token = await _userManager.GenerateChangePhoneNumberTokenAsync(user, updateNumber.phoneNumber);
                if (!ModelState.IsValid)
                    return ValidationError();
                var ChangeUserPhoneNumber = await _userManager.ChangePhoneNumberAsync(user, updateNumber.phoneNumber, Token);
                if (ChangeUserPhoneNumber.Succeeded)
                {
                    return ApiResponse(ChangeUserPhoneNumber, message: "Phone Number changed Successfully");
                }
                return ApiError(ChangeUserPhoneNumber.ToString());
            }
            catch (Exception ex)
            {
                return ApiError(ex.Message);
            }
        }

        [HttpPut("UpdateUserName")]
        public async Task<IActionResult> UpdateUserName([FromBody] UpdateUserNameVM UpdateUserName)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId);
                var ChangeUserName = await _userManager.SetUserNameAsync(user, UpdateUserName.userName);
                if (ChangeUserName.Succeeded)
                {
                    return ApiResponse(ChangeUserName, message: "UserName changed successfully");
                }
                return ApiError(ChangeUserName.ToString());
            }
            catch (Exception ex)
            {
                return ApiError(ex.Message);
            }
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordVM changePassword)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId);
                var ChangePasswordResult = await _userManager.ChangePasswordAsync(user, changePassword.currentPassword, changePassword.newPassword);
                if (ChangePasswordResult.Succeeded)
                {
                    return ApiResponse(ChangePasswordResult, message: "Password changed successfully");
                }
                var errorMessages = ChangePasswordResult.Errors.Select(e => e.Description).ToList();
                return ApiError("Failed to change password", errorMessages, statusCode: 400);
            }
            catch (Exception ex)
            {
                return ApiError(ex.Message);
            }
        }
    }
}
