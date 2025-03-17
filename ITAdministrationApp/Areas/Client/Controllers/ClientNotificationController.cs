using ITAdministrationApp.Controllers;
using ITAdministrationApp.Manager;
using ITAdministrationApp.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ITAdministrationApp.Areas.Client.Controllers;
[Area("Client")]
[Route("api/[area]/[controller]")]
[ApiController]

public class ClientNotificationController : ApiControllerBase
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
    public async Task<IActionResult> GetNotificationUnread()
    {
        string username = GetUserName;
        Console.WriteLine(username);
        var notification = await _notificationManager.GetNotificationUnreadAsync(username);

        if (notification.Count > 0)
        {
            return ApiResponse(notification);
        }

        return ApiResponse("There are no notifications unread");
    }


    [HttpGet("GetReadNotifications")]
    public async Task<IActionResult> GetNotificationRead(int pagenumber, int limit, string sortColumn, string sortOrder)
    {
        string username = GetUserName;
        var notification = await _notificationManager.GetNotificationReadAsync(username);
        if (notification is not null)
        {
            return ApiResponse(notification);
        }
        return ApiResponse("No Read Notifications Found");
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