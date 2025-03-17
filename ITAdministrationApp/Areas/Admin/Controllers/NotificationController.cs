using ITAdministrationApp.Controllers;
using ITAdministrationApp.Manager;
using ITAdministrationApp.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Mvc;


namespace ITAdministrationApp.Areas.Admin.Controllers;
[Area("Admin")]
[Route("api/[area]/[controller]")]
[ApiController]

public class NotificationController : ApiControllerBase
{
    private readonly NotificationManager _notificationManager = new();

    [HttpGet("GetAllNotifications")]
    public async Task<IActionResult> GetNotifications()
    {
        string username = GetUserName;
        var notifications = await _notificationManager.GetNotificationsAsync(username);
        return ApiResponse(notifications);
    }

    [HttpGet("GetUnreadNotifications")]
    public async Task<IActionResult> GetNotificationUnread(int PageNumber = 1, int limit = 5, string sortColumn = "CreatedAt", string sortOrder = "DESC")
    {
        try
        {
            var username = GetUserName;
            var notification = await _notificationManager.GetNotificationUnreadAsync(username);

            return ApiResponse(notification);

        }
        catch (Exception ex)
        {
            return ApiError("Error occured while getting unread notifications", statusCode: 500);

        }
    }


    [HttpGet("GetReadNotifications")]
    public async Task<IActionResult> GetNotificationRead()
    {
        try
        {
            string username = GetUserName;
            var notification =
                await _notificationManager.GetNotificationReadAsync(username);

            if (notification.Count > 0)
            {
                return ApiResponse(notification);
            }

            return ApiResponse("There are no notifications unread");
        }
        catch (Exception ex)
        {
            return ApiError("Error occured while getting read notifications", statusCode: 500);
        }
    }

    [HttpPost("MarkAsRead/{id}")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        if (id <= 0)
        {
            return ApiError("Notification id cannot be negative");
        }

        var result = await _notificationManager.MarkNotificationAsReadAsync(id);

        if (!result) // if the result is false show error
        {
            return ApiError("Failed to mark notification as read");
        }

        return ApiResponse("Notification marked as read");
    }
}