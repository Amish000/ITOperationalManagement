using ITAdministrationApp.Data;
using ITAdministrationApp.Models;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using Microsoft.EntityFrameworkCore.Sqlite.Migrations.Internal;
using SQLHelper;

namespace ITAdministrationApp.Manager;

public class NotificationManager
{
   public async Task<OperationResponse<string>> AddNotificationAsync(string message, int notificationType, string username)
   {
      OperationResponse<string> response = new OperationResponse<string>();
      
      SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
      IList<KeyValue> param = new List<KeyValue>();
      {
         param.Add(new KeyValue("@Message", message));
         param.Add(new KeyValue("@NotificationType", notificationType));
         param.Add(new KeyValue("@To", username));
      }
      
      int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[usp_Notification_Create]", param, "@OpStatus");

      if (opStatus > 0)
      {
         response.Result = "Success";
      }
      else
      {
         response.Result = "Failed";
      }

      return response;
   }

   public async Task<List<Notification>> GetNotificationsAsync(string username)
   {
      SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
      IList<KeyValue> param = new List<KeyValue>()
      {
         new KeyValue("@To", username),
      };
      var notificationList = await sqlHelper.ExecuteAsListAsync<Notification>("[dbo].[usp_Notification_GetAll]", param);
      return notificationList;
   }

   public async Task<bool> MarkNotificationAsReadAsync(int notificationId)
   {
      SQLHandlerAsync sqlHelper = new SQLHandlerAsync();

      IList<KeyValue> param = new List<KeyValue>()
      {
         new KeyValue("@Id", notificationId),
      };
      try
      {
         var opStatus = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_Notification_MarkRead]", param);
         return opStatus > 0;
      }
      catch (Exception ex)
      {
         return false;
      }

   }

   public async Task<List<Notification>> GetNotificationUnreadAsync(string username)
   {
      SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
      IList<KeyValue> param = new List<KeyValue>()
      {
         new KeyValue("@To", username),
      };
      var notification = await sqlHelper.ExecuteAsListAsync<Notification>("[dbo].[usp_Notification_GetUnread]", param);
      return notification;
   }
   
   public async Task<List<Notification>> GetNotificationReadAsync(string username)
   {
      SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
      IList<KeyValue> param = new List<KeyValue>()
      {
         new KeyValue("@To", username),
      };
      var notification = await sqlHelper.ExecuteAsListAsync<Notification>("[dbo].[usp_Notification_GetRead]",param);
      return notification;
   }

   // public async Task<bool> MarkNotificationReadAsync(int notificationId)
   // {
   //    OperationResponse<string> response = new OperationResponse<string>();
   //    SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
   //    IList<KeyValue> param = new List<KeyValue>()
   //    {
   //       new KeyValue("@Id", notificationId),
   //    };
   //    
   //    var opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[usp_Notification_MarkRead]", param);
   //    return opStatus > 0;
   // }
}