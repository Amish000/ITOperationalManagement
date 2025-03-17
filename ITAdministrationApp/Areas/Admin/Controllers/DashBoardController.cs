using ITAdministrationApp.Areas.Admin.Provider;
using ITAdministrationApp.Controllers;
using ITAdministrationApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLHelper;

namespace ITAdministrationApp.Areas.Admin.Controllers;

[Area("admin")]
[Route("api/[area]/[controller]")]
[ApiController]
public class DashBoardController : ApiControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly TicketManagerAdmin _ticketManagerAdmin;

    public DashBoardController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext ?? throw new ArgumentNullException(nameof(applicationDbContext));
        _ticketManagerAdmin = new TicketManagerAdmin();
    }

    // ---------------Get Total Users with (user) Role
    [HttpGet("GetUserCount")]
    public async Task<IActionResult> GetTotalUsers()
    {
        try
        {
            var allUsersCount = await _applicationDbContext.UserRoles.CountAsync();
            var allUsersWithUserRole = await (from user in _applicationDbContext.Users
                                              join userRole in _applicationDbContext.UserRoles on user.Id equals userRole.UserId
                                              join role in _applicationDbContext.Roles on userRole.RoleId equals role.Id
                                              where role.Name == "User"
                                              select user).ToListAsync();
            return ApiResponse(allUsersWithUserRole.Count());
        }
        catch (Exception ex)
        {
            return ApiError("Failed to get user count");
        }
    }

    [HttpGet("GetTicketsCount")]
    public async Task<IActionResult> GetActivePendingTickets()
    {
        Task<int> ActiveTicket = _ticketManagerAdmin.GetActiveTicketCountAsync();
        Task<int> PendingTicket = _ticketManagerAdmin.GetPendingTicketCountAsync();
        int totalTickets = ActiveTicket.Result + PendingTicket.Result;
        return ApiResponse(totalTickets);
    }

    [HttpGet("GetLoggedInUserName")]
    public async Task<IActionResult> GetLoggedInUserName()
    {
        string userName = GetUserName;
        return ApiResponse(userName);
    }
    [HttpGet("GetExpiredServices")]
    public async Task<IActionResult> GetExpiredServices()
    {
        var result = await _ticketManagerAdmin.GetExpiredItServiceCountAsync();
        return ApiResponse(result);
    }
}