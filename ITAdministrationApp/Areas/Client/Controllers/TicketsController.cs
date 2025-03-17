using Common.Lib.Areas.Client.ViewModels;
using ITAdministrationApp.Areas.Admin.Models;
using ITAdministrationApp.Areas.Admin.Provider;
using ITAdministrationApp.Base;
using ITAdministrationApp.Controllers;
using ITAdministrationApp.Manager;
using ITAdministrationApp.Models;
using ITAdministrationApp.ViewModels;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TicketManagement.Models;
using WebApp.Models;
using TicketUpdateViewModel = Common.Lib.Areas.Client.ViewModels.TicketUpdateViewModel;

//using ITAdministrationApp.Services;

namespace ITAdministrationApp.Areas.Client.Controllers
{
    [Area("Client")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class TicketsController(
        IWebHostEnvironment hostingEnvironment,
        ILogger<TicketsController> logger)
        : ApiControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment = hostingEnvironment;
        private readonly ILogger<TicketsController> _logger = logger;
        private readonly NotificationManager _notificationManager = new NotificationManager();
        private readonly LogTicketManager _logTicketManager = new LogTicketManager();

        //_ticketService = ticketService;



        //-------------------------------------Index page for Client API ----------------------------------------------
        [HttpGet("GetUserTickets")]
        public async Task<IActionResult> GetUserTicket(string search = "", string sortColumn = "TicketID", string sortOrder = "DESC", int page = 1, int pageSize = 5)
        {
            var ticketManager = new TicketManager();
            try
            {

                var user = GetUserName ?? "";
                var allTickets = await ticketManager.GetTicketsByUser(1, int.MaxValue, sortColumn, sortOrder, user, search);

                // Apply search filter if search keyword is provided
                if (!string.IsNullOrWhiteSpace(search))
                {
                    allTickets = allTickets
                        .Where(c => c.Title.Contains(search, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                // Map database model to view model
                var ticketModel = allTickets.Select(ticket => new TicketDetailViewModel
                {
                    RowNumber = ticket.RowNumber,
                    id = ticket.TicketID,
                    Title = ticket.Title,
                    Description = ticket.Description,
                    Priority = ((EnumServiceTicketPriority)ticket.Priority).ToString(),
                    RequestedBy = ticket.RequestedBy,
                    RequestedOn = ticket.RequestedOn,
                    TicketStatusId = ((EnumServiceTicketStatus)ticket.TicketStatusID).ToString(),
                    AssignedTo = ticket.AssignTo,
                    LastUpdatedOn = ticket.LastUpdatedOn
                }).ToList();

                var totalItems = ticketModel.Count();
                var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                var paginatedServices = ticketModel.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                return ApiResponse(new
                {
                    services = paginatedServices,
                    pagination = new
                    {
                        currentPage = page,
                        pageSize,
                        totalItems,
                        totalPages,
                        sortColumn,
                        sortOrder,
                        search
                    }
                }, "Services retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiError(ex.Message);
            }
        }

        [HttpGet("ActiveTicket")]
        public async Task<IActionResult> ActiveTicket(string search = "", string sortColumn = "LastUpdatedOn", string sortOrder = "DESC", int page = 1, int pageSize = 5)
        {
            var ticketManager = new TicketManager();
            try
            {
                var username = GetUserName;
                var allTickets = await ticketManager.GetActiveTickets(1, int.MaxValue, sortColumn, sortOrder, username, search);

                // Apply search filter if search keyword is provided
                if (!string.IsNullOrWhiteSpace(search))
                {
                    allTickets = allTickets
                        .Where(c => c.Title.Contains(search, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                //create a list to store the TicketDetailView model objects
                var ticketModel = allTickets.Select(ticket => new TicketDetailViewModel()
                {
                    RowNumber = ticket.RowNumber,
                    id = ticket.TicketID,
                    Title = ticket.Title,
                    Description = ticket.Description,
                    Priority = ((EnumServiceTicketPriority)ticket.Priority).ToString(),
                    RequestedBy = ticket.RequestedBy,
                    RequestedOn = ticket.RequestedOn,
                    TicketStatusId = ((EnumServiceTicketStatus)ticket.TicketStatusID).ToString(),
                    AssignedTo = ticket.AssignTo,
                    LastUpdatedOn = ticket.LastUpdatedOn
                }).ToList();

                var totalItems = allTickets.Count();
                var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                var paginatedServices = ticketModel.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                return ApiResponse(new
                {
                    services = paginatedServices,
                    pagination = new
                    {
                        currentPage = page,
                        pageSize,
                        totalItems,
                        totalPages,
                        sortColumn,
                        sortOrder,
                        search
                    }
                }, "Services retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiError(ex.Message);
            }
        }
        [HttpGet("SettledTickets")]
        public async Task<IActionResult> Settledtickets(string search = "", string sortColumn = "LastUpdatedOn", string sortOrder = "DESC", int page = 1, int pageSize = 5)
        {
            var ticketManager = new TicketManager();
            try
            {
                var user = GetUserName;

                var allTickets = await ticketManager.GetSettledTickets(page, pageSize, sortColumn, sortOrder, user, search);

                // Apply search filter if search keyword is provided
                if (!string.IsNullOrWhiteSpace(search))
                {
                    allTickets = allTickets
                        .Where(c => c.Title.Contains(search, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                var ticketModel = allTickets.Select(ticket => new TicketDetailViewModel()
                {
                    RowNumber = ticket.RowNumber,
                    id = ticket.TicketID,
                    Title = ticket.Title,
                    Description = ticket.Description,
                    Priority = ((EnumServiceTicketPriority)ticket.Priority).ToString(),
                    RequestedBy = ticket.RequestedBy,
                    RequestedOn = ticket.RequestedOn,
                    TicketStatusId = ((EnumServiceTicketStatus)ticket.TicketStatusID).ToString(),
                    AssignedTo = ticket.AssignTo,
                    LastUpdatedOn = ticket.LastUpdatedOn
                });

                var totalItems = allTickets.Count();
                var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                var paginatedServices = ticketModel.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                return ApiResponse(new
                {
                    services = paginatedServices,
                    pagination = new
                    {
                        currentPage = page,
                        pageSize,
                        totalItems,
                        totalPages,
                        sortColumn,
                        sortOrder,
                        search
                    }
                }, "Services retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiError(ex.Message);
            }
        }

        // ----------------Get By ID---------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            //object of the class which has methods to get data from the database 
            var ticketManager = new TicketManager();

            //ticketManager method returns ServiceTicketModel object
            ServiceTicketModel model = await ticketManager.GetTicket(id);

            if (model == null)
            {
                return ApiError("Ticket not found");
            }

            // create an object of the ViewModel with only the required fields 
            var ticket = new TicketDetailViewModel
            {
                id = model.TicketID,
                Title = model.Title,
                Description = model.Description,
                Priority = ((EnumServiceTicketPriority)model.Priority).ToString(),
                RequestedBy = model.RequestedBy,
                RequestedOn = model.RequestedOn,
                TicketStatusId = ((EnumServiceTicketStatus)model.TicketStatusID).ToString(),
                AssignedTo = model.AssignTo,
                LastUpdatedOn = model.LastUpdatedOn
            };


            //return JSON of the ViewModel 
            return ApiResponse(ticket);
        }

        //still remaining to format error and return success response 
        [HttpPost("Add")]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add([FromBody] TicketCreatedViewModel Model)
        {
            var ticketManager = new TicketManager();

            // set username to StaticUser if the User is null 
            string username = GetUserName;

            if (string.IsNullOrEmpty(Model.Title))
            {
                return ApiError("Title is required");
            }
            if (!Enum.IsDefined(typeof(EnumServiceTicketPriority), Model.Priority))
            {
                return ApiError("Priority must be a valid value");
            }

            var result = await ticketManager.CreateTicket(Model, username);

            // Correct the condition to check if resulted.Result is a success message string
            if (result != null && !string.IsNullOrEmpty(result.Result))
            {
                string notificationMessage = $"A new ticket '{Model.Title}' has been created by {username}.";
                await _notificationManager.AddNotificationAsync(notificationMessage, 1, "superadmin");
                return ApiResponse(result);
            }
            return ApiError("Ticket not created");
        }

        //--------------------------Delete Ticket by ID-------------------------

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ticketManager = new TicketManager();
            var isDeleted = await ticketManager.DeleteTicket(id);
            if (!isDeleted)
            {
                return ApiError("Ticket not found");
            }

            await _logTicketManager.DeleteActivityLog(id);
            return ApiResponse("Ticket deleted");
        }

        // -------------------update ticket by id ---------------------------
        [HttpPost("update/{ticketId}")]
        public async Task<IActionResult> Update([FromBody] TicketUpdateViewModel model, [FromRoute] int ticketId)
        {
            var ticketManager = new TicketManager();

            var isTicketAvailable = await ticketManager.GetTicket(ticketId);

            if (isTicketAvailable == null)
            {
                return ApiError("Ticket not found");
            }
            if (isTicketAvailable.RequestedBy != GetUserName)
            {
                return ApiError("You can only update your own tickets");
            }

            var result = await ticketManager.UpdateTicket(model, ticketId);

            if (result)
            {
                var user = GetUserName;
                string remarks = "Ticket Updated to " + ((EnumServiceTicketStatus)isTicketAvailable.TicketStatusID) + " by " + user;

                await _logTicketManager.AddActivityLog(ticketId, "Update of ticket", remarks, isTicketAvailable.TicketStatusID, isTicketAvailable.TicketStatusID, user, "Update");

                return ApiResponse("Ticket updated successfully");
            }
            return ApiError("Ticket not updated");
        }
    }
}