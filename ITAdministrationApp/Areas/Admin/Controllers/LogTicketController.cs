using ITAdministrationApp.Areas.Admin.Models;
using ITAdministrationApp.Areas.Admin.ViewModels;
using ITAdministrationApp.Base;
using ITAdministrationApp.Controllers;
using ITAdministrationApp.Models;
using ITAdministrationApp.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketManagement.Models;

namespace ITAdministrationApp.Clien;

[Area("Admin")]
[Route("api/[area]/[controller]")]
[ApiController]
public class LogTicketController : ApiControllerBase

{
    private readonly IWebHostEnvironment _hostingEnvironment;
    private readonly LogTicketManager _LogTicketManager;
    private readonly TicketManager _TicketManager;

    public LogTicketController(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
        _LogTicketManager = new LogTicketManager();
        _TicketManager = new TicketManager();

    }

    // [HttpGet("Index")]
    // public async Task<IActionResult> Index(string searchKeyword = "", string sortColumn = "TicketID",
    //     string sortOrder = "ASC", int page = 1, int pageSize = 5)
    // {
    //
    //     var allTickets = await _LogTicketManager.GetAllActivities(page, pageSize, searchKeyword, sortColumn, sortOrder);
    //
    //     // Count total number of items
    //     var totalItems = allTickets.Count();
    //
    //     // Apply pagination
    //     var ticketModel = allTickets.Select(log => new LogDetailViewModel()
    //     {
    //         RowNumber = log.RowNumber,
    //         LogID = log.LogID,
    //         TicketID = log.TicketID,
    //         Title = log.Title,
    //         PrevTicketStatusID = ((EnumServiceTicketStatus)log.PrevTicketStatusID).ToString(),
    //         CurrentTicketStatusID = ((EnumServiceTicketStatus)log.CurrentTicketStatusID).ToString(),
    //         ActionBy = log.ActionBy,
    //         ActionOn = log.ActionOn,
    //         Remarks = log.Remarks,
    //         ServiceTicketTitle = log.ServiceTicketTitle
    //     }).ToList();
    //
    //     var totalPages = (int)Math.Ceiling((double)allTickets.Count / pageSize);
    //     return ApiResponse(allTickets);
    //
    // }

    [HttpGet("{ticketID}")]
    public async Task<IActionResult> GetLogByTicketID([FromRoute] int ticketID, string searchKeyword = "",
        string sortColumn = "TicketID", string sortOrder = "ASC", int page = 1, int pageSize = 5)
    {

        try
        {
            var allTickets =
                await _LogTicketManager.GetLogByTicketID(page, pageSize, ticketID, searchKeyword, sortColumn,
                    sortOrder);

            var TicketLog = allTickets.Select(log => new LogDetailViewModel()
            {
                RowNumber = log.RowNumber,
                LogID = log.LogID,
                TicketID = log.TicketID,
                Title = log.Title,
                ServiceTicketTitle = log.ServiceTicketTitle,
                PrevTicketStatusID = ((EnumServiceTicketStatus)log.PrevTicketStatusID).ToString(),
                CurrentTicketStatusID = ((EnumServiceTicketStatus)log.CurrentTicketStatusID).ToString(),
                ActionOn = log.ActionOn,
                ActionBy = log.ActionBy,
                Remarks = log.Remarks,
                ActionType = log.ActionType,
            }).ToList();

            // Count total number of items
            var totalItems = allTickets.Count();
            var totalPages = (int)Math.Ceiling((double)allTickets.Count / pageSize);

            // return ApiResponse(TicketLog);
            return ApiResponse(
                new
                {
                    services = TicketLog,
                    pagination = new
                    {
                        currentPage = page,
                        pageSize,
                        totalItems,
                        totalPages,
                        sortColumn,
                        sortOrder,
                        searchKeyword,
                    }
                }, "Logs Retrieved successfully");
        }
        catch (Exception ex)
        {
            return ApiError(ex.Message);
        }

        // [HttpPost("Create")]
        // public async Task<IActionResult> Create([FromBody] LogTicketAddViewModel model, string actionType, string username)
        // {
        //      ServiceTicketModel ticket = await _TicketManager.GetTicket(model.TicketID);
        //      
        //     var result = await _LogTicketManager.AddActivityLog(model, ticket.TicketStatusID, actionType, username);
        //     
        //     return ApiResponse(result);
        // }

    }
}