using System.Collections;
using ITAdministrationApp.Areas.Admin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using SQLHelper;


namespace ITAdministrationApp.Areas.Admin.Models
{
    public class LogTicketManager
    {
        public async Task<List<LogTicketModel>> GetAllActivities(int offset, int limit, string searchKeyword = "", string sortColumn = "lt.TicketID", string sortOrder = "ASC")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                //new KeyValue("@LogID",),
                new KeyValue("@Offset", offset),
                new KeyValue("@Limit", limit),
                new KeyValue("@searchKeyword", searchKeyword),
                new KeyValue("@SortColumn", sortColumn),
                new KeyValue("@SortOrder", sortOrder)
            };
            var TheList = await sqlHelper.ExecuteAsListAsync<LogTicketModel>("[dbo].[GetAllActivities]", param);
            Console.WriteLine(TheList.Count);
            return TheList;
        }

        public async Task<List<LogTicketModel>> GetLogByTicketID(int offset, int limit, int ticketID, string searchKeyword = "", string sortColumn = "lt.TicketID", string sortOrder = "ASC")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                //new KeyValue("@LogID",),
                new KeyValue("@TicketID",ticketID),
                new KeyValue("@pageNumber", offset),
                new KeyValue("@pageSize", limit),
                new KeyValue("@searchKeyword", searchKeyword),
                new KeyValue("@SortColumn", sortColumn),
                new KeyValue("@SortOrder", sortOrder)
            };
            var logList = await sqlHelper.ExecuteAsListAsync<LogTicketModel>("[dbo].[usp_LogTicket_GetByTicketID]", param);
            return logList;
        }

        public async Task<OperationResponse<string>> AddActivityLog(int TicketID, string Title, string remarks, int previousTicketStatus, int currentTicketStatus, string actionBy, string actionType, bool isDeleted = false)
        {
            OperationResponse<string> opResponse = new OperationResponse<string>();
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>()
            {
                new KeyValue("@TicketID", TicketID),
                new KeyValue("@Title", Title),
                new KeyValue("@PrevTicketStatusID", previousTicketStatus),
                new KeyValue("@CurrentTicketStatusID", currentTicketStatus),
                new KeyValue("@Remarks", remarks),
                new KeyValue("@IsDeleted", isDeleted),
                new KeyValue("@ActionBy", actionBy),
                new KeyValue("@ActionType", actionType)
            };
            var opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[LogTicketActivity]", param, "@OpStatus");
            opResponse.Result = opStatus > 0 ? "Success" : "Failed";
            return opResponse;
        }

        public async Task<bool> DeleteActivityLog(int TicketID)
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>()
            {
                new KeyValue("@TicketID", TicketID)
            };
            var opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[usp_LogTicketActivity_Delete]", param);
            return opStatus > 0;
        }

    }

}
