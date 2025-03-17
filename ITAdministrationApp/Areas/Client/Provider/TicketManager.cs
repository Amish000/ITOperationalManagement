using Common.Lib.Areas.Client.ViewModels;
using ITAdministrationApp;
using ITAdministrationApp.Base;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SQLHelper;
using TicketManagement.Models;
using TicketUpdateViewModel = Common.Lib.Areas.Client.ViewModels.TicketUpdateViewModel;

public class TicketManager
{
    public async Task<OperationResponse<string>> CreateTicket(TicketCreatedViewModel model, string username)
    {
        OperationResponse<string> response = new OperationResponse<string>();

        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
        IList<KeyValue> param = new List<KeyValue>();
        {
            param.Add(new KeyValue("@TicketID", 0));
            param.Add(new KeyValue("@Title", model.Title));
            param.Add(new KeyValue("@Description", model.Description));
            param.Add(new KeyValue("@Priority", model.Priority));
            param.Add(new KeyValue("@RequestedBy", username));
            param.Add(new KeyValue("@AssignTo", "Admin"));
            param.Add(new KeyValue("@AssignedBy", "SuperAdmin"));
        };

        int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[usp_AddServiceTicket]", param, "@OpStatus");

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

    public async Task<List<ServiceTicketModel>> GetAllTickets(int PageNumber, int limit, string sortColumn, string sortOrder, string searchKeyword = "")
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
        var theList = await sqlHelper.ExecuteAsListAsync<ServiceTicketModel>("[dbo].[usp_ServiceTicket_GetAll]", param);
        return theList;
    }

    public async Task<List<ServiceTicketModel>> GetTicketsByUser(int PageNumber, int limit, string sortColumn, string sortOrder, string username, string searchKeyword = "")
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
        IList<KeyValue> param = new List<KeyValue>
        {
            new KeyValue("@PageNumber", PageNumber),
            new KeyValue("@Limit", limit),
            new KeyValue("@searchKeyword", searchKeyword),
            new KeyValue("@SortColumn", sortColumn),
            new KeyValue("@SortOrder", sortOrder),
            new KeyValue("@User", username)
        };
        var theList = await sqlHelper.ExecuteAsListAsync<ServiceTicketModel>("[dbo].[usp_ServiceTicket_GetByClient]", param);
        return theList;
    }

    public async Task<List<ServiceTicketModel>> GetActiveTickets(int PageNumber, int limit, string sortColumn, string sortOrder, string username, string searchKeyword = "")
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
        IList<KeyValue> param = new List<KeyValue>
        {
            new KeyValue("@PageNumber", PageNumber),
            new KeyValue("@Limit", limit),
            new KeyValue("@searchKeyword", searchKeyword),
            new KeyValue("@SortColumn", sortColumn),
            new KeyValue("@User", username),
            new KeyValue("@SortOrder", sortOrder),

        };
        var theList = await sqlHelper.ExecuteAsListAsync<ServiceTicketModel>("[dbo].[usp_ServiceTicket_GetActive_Client]", param);
        return theList;
    }



    public async Task<List<ServiceTicketModel>> GetSettledTickets(int PageNumber, int limit, string sortColumn, string sortOrder, string user, string searchKeyword = "")
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
        IList<KeyValue> param = new List<KeyValue>
        {
            new KeyValue("@PageNumber", PageNumber),
            new KeyValue("@Limit", limit),
            new KeyValue("@searchKeyword", searchKeyword),
            new KeyValue("@SortColumn", sortColumn),
            new KeyValue("@SortOrder", sortOrder),
            new KeyValue("@User", user)
        };
        var theList = await sqlHelper.ExecuteAsListAsync<ServiceTicketModel>("[dbo].[usp_ServiceTicket_GetSettled_User]", param);
        return theList;
    }

    // Get tickets by taking id as parameter
    public async Task<ServiceTicketModel> GetTicket(int id)
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();

        IList<KeyValue> param = new List<KeyValue>()
        {
            new KeyValue("@TicketID", id),
        };

        var ticket = await sqlHelper.ExecuteAsObjectAsync<ServiceTicketModel>("[dbo].[GetTicketById]", param);
        return ticket;
    }

    public async Task<bool> DeleteTicket(int id)
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();

        IList<KeyValue> param = new List<KeyValue>()
        {
            new KeyValue("@TicketId", id),
        };

        var result = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_ServiceTicket_Delete]", param);
        return result > 0;
    }

    public async Task<bool> UpdateTicket(TicketUpdateViewModel ticket, int id)
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();

        IList<KeyValue> param = new List<KeyValue>()
        {
            new KeyValue("@TicketId", id),
            new KeyValue("@Title", ticket.Title),
            new KeyValue("@Description", ticket.Description),
            new KeyValue("@Priority", ticket.Priority)
        };
        var result = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_ServiceTicket_Update_Client]", param);
        return result > 0;
    }
    public async Task<int> GetTotalTicketsCount(string username)
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
        IList<KeyValue> param = new List<KeyValue>()
        {
            new KeyValue("@Username", username)
        };
        var tickets = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_GetTicketsByUsernameTotalCount]", param);
        return tickets;
    }

    public async Task<int> GetActiveTicketsCount(string username)
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
        IList<KeyValue> param = new List<KeyValue>()
        {
            new KeyValue("@Username", username)
        };
        var tickets = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_GetActiveTicketCount_User]", param);
        return tickets;
    }

    public async Task<int> GetSettledTicketsCount(string username)
    {
        SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
        IList<KeyValue> param = new List<KeyValue>()
        {
            new KeyValue("@Username", username)
        };
        var tickets = await sqlHelper.ExecuteAsScalarAsync<int>("[dbo].[usp_GetSettledTicketsCount_User]", param);
        return tickets;
    }

}
