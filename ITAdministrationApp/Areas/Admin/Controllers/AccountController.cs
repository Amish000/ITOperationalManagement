using System.Net;
using System.Security.Claims;
using ITAdministrationApp.Areas.Admin.ViewModels;
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
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.IdentityModel.Tokens;
using NuGet.DependencyResolver;

namespace ITAdministrationApp.Areas.Admin.Controllers;

[Authorize]  // Default authorization for all actions
[Area("Admin")]
[Route("api/[area]/[controller]")]
[ApiController]
public class AccountController : ApiControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IEmailSender _emailSender;
    private readonly ILogger _logger;
    private readonly IJwtService _jwtService;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IEmailSender emailSender,
        ILoggerFactory loggerFactory,
        IJwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _emailSender = emailSender;
        _logger = loggerFactory.CreateLogger<AccountController>();
        _jwtService = jwtService;
    }

    // Get all the users

    [HttpGet("GetUsers")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetUsers(string search = "", int page = 1, int pageSize = 5)
    {
        try
        {
            var users = await _userManager.GetUsersInRoleAsync("User");

            var filteredUsers = users.Where(user => user.Email.Contains(search, StringComparison.OrdinalIgnoreCase)).ToList();
            ApiResponse(filteredUsers, message: "User retrieved sucesfully!");

            int totalItems = filteredUsers.Count();

            var paginatedUsers = filteredUsers.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            int totalPages = (int)Math.Ceiling((decimal)totalItems / pageSize);

            return ApiResponse(new
            {
                users = paginatedUsers,
                pagination = new
                {
                    currentPage = page,
                    pageSize,
                    totalItems,
                    totalPages,
                    search
                }
            }, "Users retireved succesfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Users");
            return ApiError(message: "Failed to retrieve users");
        }
    }

    [HttpPost("UserEnableDisable")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> UserEnableDisable(UserStatusChangeViewModel model)
    {
        try
        {

            // Find and return the user using the user Id
            var user = await _userManager.FindByIdAsync(model.UserId);
            // check if the user is null or not 
            if (user == null)
            {
                // response if the user is not in the database
                return ApiResponse(user, message: "No user with that ID");
            }
            else
            {
                // for enabling the use account
                if (model.Action)
                {
                    await _userManager.SetLockoutEnabledAsync(user, false);
                }
                // for disabling the user account
                else
                {
                    await _userManager.SetLockoutEnabledAsync(user, true);
                    await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
                }
                return ApiResponse(user, "Success");
            }
        }
        catch (Exception ex)
        {
            return ApiError(ex.ToString());
        }
    }

    [HttpPut("UpdateUser")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> UpdateUser(UpdateUserViewModel model)
    {
        var user = await _userManager.FindByIdAsync(model.id);
        try
        {
            if (user != null)
            {
                user.Email = model?.email;
                user.PhoneNumber = model?.phoneNumber;
                user.UserName = model?.userName;
                var result = await _userManager.UpdateAsync(user);
                return ApiResponse(result, message: "User Updated succesfully!");
            }
            else
            {
                return ApiError("No user with the provided userId", statusCode: 404);
            }

        }
        catch (Exception ex)
        {
            return ApiError(ex.ToString(), statusCode: 500);
        }

    }

    [HttpDelete("DeleteUserByID")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> DeleteUserByID([FromBody] string UserID)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(UserID);

            if (user == null)
            {
                // response if the user is not in the database
                return ApiResponse(user, message: "No user with that ID");
            }
            else
            {
                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return ApiResponse(user, message: "User Deleted Successfully");
                }
                else
                {
                    return ApiError("Failed to delete user");
                }
            }
        }
        catch (Exception ex)
        {
            return ApiError(ex.ToString());
        }
    }

    [HttpPost("ChangeUserPassword")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> ChangeUserPassword(UserPasswordChangeViewModel model)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(model.userId);
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (result.Succeeded)
            {
                return ApiResponse(result, "User password updated successfully");
            }

            return ApiError(result.ToString());

        }
        catch (Exception ex)
        {
            return ApiError(ex.ToString());
        }
    }

    [HttpPost("Login")]
    [AllowAnonymous]  // Override the controller-level authorization for login
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        try
        {
            if (!ModelState.IsValid)
                return ValidationError();

            var firstUser = _userManager.FindByEmailAsync(model.Email);

            if (firstUser != null && firstUser.Result != null)
            {
                var username = firstUser.Result.UserName;

                var result = await _signInManager.PasswordSignInAsync(username, model.Password, model.RememberMe, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);
                    var roles = await _userManager.GetRolesAsync(user);
                    var (token, refreshToken) = await _jwtService.GenerateTokensAsync(user, roles);

                    _logger.LogInformation("User {Email} logged in successfully", model.Email);

                    return ApiResponse(new
                    {
                        token,
                        refreshToken,
                        user = new
                        {
                            id = user.Id,
                            email = user.Email,
                            roles
                        }
                    }, "Login successful");
                }

                if (result.RequiresTwoFactor)
                {
                    return ApiResponse(new { requiresTwoFactor = true });
                }

                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User {Email} account locked out", model.Email);
                    return ApiError("Account locked out", statusCode: 423);
                }
            }

            return ApiError(message: "Invalid credentials", statusCode: (int)HttpStatusCode.BadRequest);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for {Email}", model.Email);
            return ApiError("Internal server error", statusCode: 500);
        }
    }

    [HttpPost("RefreshToken")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
    {
        try
        {
            var (newToken, newRefreshToken) = await _jwtService.RefreshTokenAsync(refreshToken);

            return ApiResponse(new
            {
                token = newToken,
                refreshToken = newRefreshToken
            }, "Token refreshed successfully");
        }
        catch (SecurityTokenException ex)
        {
            return UnauthorizedError(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return ApiError("Internal server error", statusCode: 500);
        }
    }

    [HttpPost("Register")]
    [Authorize(Policy = "SuperAdminOnly")]  // Use policy-based authorization
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        try
        {
            if (!ModelState.IsValid)
                return ValidationError();

            var user = new ApplicationUser
            {
                UserName = model.Email.Split("@")[0],
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                EmailConfirmed = true, // Auto-confirm since only SuperAdmin can create 
                LockoutEnabled = false,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                _logger.LogInformation("User {Email} created a new account", model.Email);

                // Assign roles based on the request
                if (model.Role == "Admin")
                {
                    await _userManager.AddToRoleAsync(user, "Admin");
                }
                else
                {
                    await _userManager.AddToRoleAsync(user, "User");
                }

                var roles = await _userManager.GetRolesAsync(user);
                var token = _jwtService.GenerateToken(user, roles);

                // set this to false 
                await _userManager.SetLockoutEnabledAsync(user, false);

                return ApiResponse(new
                {
                    token,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        roles,
                        emailConfirmed = user.EmailConfirmed
                    }
                }, "Registration successful");
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return ApiError("Registration failed", errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for {Email}", model.Email);
            return ApiError("Internal server error", statusCode: 500);
        }
    }

    [HttpPost("Logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out");
        return ApiResponse(true, "Logout successful");
    }

    [HttpPost("ConfirmEmail")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(string userId, string code)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
            return ValidationError("User ID and confirmation code are required");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFoundError("User not found");

        var result = await _userManager.ConfirmEmailAsync(user, code);
        if (result.Succeeded)
            return ApiResponse(true, "Email confirmed successfully");

        var errors = result.Errors.Select(e => e.Description).ToList();
        return ApiError("Email confirmation failed", errors);
    }

    private void AddErrors(IdentityResult result)
    {
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }
    }
}