using ITAdministrationApp.ViewModels;

namespace ITAdministrationApp.Models;

public class Notification
{
    public int Id { get; set; }
    public string Message { get; set; }
    public DateTime CreatedAt { get; set; }
    private EnumNotificationType NotificationType { get; set; }
    
    public string NotificationTypeString => NotificationType.ToString();
}