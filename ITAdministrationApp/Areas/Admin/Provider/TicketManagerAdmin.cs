using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SQLHelper;
using TicketManagement.Models;

namespace ITAdministrationApp.Areas.Admin.Provider
{
    public class TicketManagerAdmin
    {
        public async Task<List<ServiceTicketModel>> GetActiveTickets(int PageNumber, int limit, string sortColumn, string sortOrder, string searchKeyword = "")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                new KeyValue("@PageNumber", PageNumber),
                new KeyValue("@Limit", limit),
                new KeyValue("@searchKeyword", searchKeyword),
                new KeyValue("@SortColumn", sortColumn),
                new KeyValue("@SortOrder", sortOrder),
            };
            var theList = await sqlHelper.ExecuteAsListAsync<ServiceTicketModel>("[dbo].[usp_ServiceTicket_GetActive]", param);
            return theList;
        }

        public async Task<List<ServiceTicketModel>> GetSettledTickets(int PageNumber, int limit, string sortColumn, string sortOrder, string searchKeyword = "")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                new KeyValue("@PageNumber", PageNumber),
                new KeyValue("@Limit", limit),
                new KeyValue("@searchKeyword", searchKeyword),
                new KeyValue("@SortColumn", sortColumn),
                new KeyValue("@SortOrder", sortOrder)
            };
            var theList = await sqlHelper.ExecuteAsListAsync<ServiceTicketModel>("[dbo].[usp_ServiceTicket_GetSettled]", param);
            return theList;
        }

        public async Task<bool> UpdateTicketStatus(int TicketID, string Title, string Description, int statusID)
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                new KeyValue("@Title", Title),
                new KeyValue("@Description", Description),
                new KeyValue("@TicketID", TicketID),
                new KeyValue("@StatusID", statusID),
            };
            var result = await sqlHelper.ExecuteNonQueryAsync("[dbo].[UpdateTicketStatus]", param);
            return result > 0;
        }

        public async Task<bool> UpdateTicketStatusIdAdmin(int TicketID, int StatusID)
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>()
            {
                new KeyValue("@TicketID", TicketID),
                new KeyValue("@StatusID", StatusID),
            };
            var result = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_UpdateTicketStatusIdAdmin]", param);
            return result > 0;
        }

        public async Task<TicketUpdateViewModel> GetTicketById(int ticketId)
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                new KeyValue("@TicketID", ticketId)
            };
            var ticket = await sqlHelper.ExecuteAsObjectAsync<TicketUpdateViewModel>("[dbo].[GetTicketById]", param);
            return ticket;
        }

        public async Task<int> GetActiveTicketCountAsync()
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            int tickets = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_ServiceTicket_ActiveCount]");
            return tickets;
        }

        public async Task<int> GetPendingTicketCountAsync()
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            int tickets = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_ServiceTicket_PendingCount]");
            return tickets;
        }

        public async Task<int> GetExpiredItServiceCountAsync()
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            int tickets = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_ITService_ExpiredCount]");
            return tickets;
        }

        public async Task<int> GetPreviousTicketStatusId(int id)
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>()
            {
                new KeyValue("@TicketID", id)
            };
            int result = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_ITService_GetPreviousTicketStatus]", param);
            return result;
        }
    }
}