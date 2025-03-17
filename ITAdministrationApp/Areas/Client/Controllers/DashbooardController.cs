using ITAdministrationApp.Controllers;
using ITAdministrationApp.Controllers;
using ITAdministrationApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLHelper;


namespace ITAdministrationApp.Areas.Client.Controllers;
[Area("client")]
[Route("api/[area]/[controller]")]
[ApiController]

public class DashboardController : ApiControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly TicketManager _ticketManager;

    public DashboardController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
        _ticketManager = new TicketManager();
    }


    [HttpGet("GetTotalTicketCount")]
    public async Task<IActionResult> GetTotalTickets()
    {
        try
        {
            var username = GetUserName;
            var alltickets = await _ticketManager.GetTotalTicketsCount(username);
            return ApiResponse(alltickets);
        }
        catch (Exception ex)
        {
            return ApiError("Data not retrieved", statusCode: 500);
        }

    }

    [HttpGet("GetActiveTicketCount")]

    public async Task<IActionResult> GetActiveTickets()
    {
        try
        {
            var username = GetUserName;
            var activeTicketCount = await _ticketManager.GetActiveTicketsCount(username);
            return ApiResponse(activeTicketCount);
        }
        catch (Exception ex)
        {
            return ApiError("Data not retrieved", statusCode: 500);
        }
    }

    [HttpGet("GetSettledTicketCount")]
    public async Task<IActionResult> GetSettledTickets()
    {
        try
        {
            var username = GetUserName;
            var settledTicketCount = await _ticketManager.GetSettledTicketsCount(username);
            return ApiResponse(settledTicketCount);
        }
        catch (Exception ex)
        {
            return ApiError("Data not retrieved", statusCode: 500);
        }
    }
}