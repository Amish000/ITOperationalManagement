using Common.Lib.Areas.Client.ViewModels;
using ITAdministrationApp.Areas.Admin.Models;
using ITAdministrationApp.Areas.Admin.Provider;
using ITAdministrationApp.Base;
using ITAdministrationApp.Controllers;
using ITAdministrationApp.Data;
using ITAdministrationApp.Manager;
using ITAdministrationApp.ViewModels;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CodeActions;
using Microsoft.EntityFrameworkCore;
using TicketManagement.Models;

using TicketUpdateViewModel = Common.Lib.Areas.Client.ViewModels.TicketUpdateViewModel;
namespace ITAdministrationApp.Areas.Admin.Controllers
{
    [Area("admin")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class TicketsController(IWebHostEnvironment hostingEnvironment, ILogger<TicketsController> logger)
        : ApiControllerBase
    {
        private readonly TicketManagerAdmin _TicketManagerAdmin = new();
        private readonly NotificationManager _notificationManager = new();
        private readonly TicketManager _ticetManager = new();
        private readonly LogTicketManager _logTicketManager = new();

        [HttpGet("Index")]
        public async Task<IActionResult> Index(string search = "", string sortColumn = "LastUpdatedOn", string sortOrder = "DESC", int page = 1, int pageSize = 5)
        {
            var ticketManager = new TicketManager();
            try
            {
                var allTickets = await ticketManager.GetAllTickets(1, int.MaxValue, sortColumn, sortOrder, "");

                // Apply search filter if search keyword is provided
                if (!string.IsNullOrWhiteSpace(search))
                {
                    allTickets = allTickets
                        .Where(c => c.Title.Contains(search, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                //create a list to store the TicketDetailView model objects
                List<TicketDetailViewModel> ticketModel = new List<TicketDetailViewModel>();

                //loop through all the objects form the database
                foreach (var ticket in allTickets)
                {
                    //create new model with the required fields and store in model
                    TicketDetailViewModel model = new TicketDetailViewModel()
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
                    };
                    // add the model to the object list 
                    ticketModel.Add(model);
                }

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
                return ApiError("Failed to retrieve services", statusCode: 500);
            }
        }

        [HttpGet("ActiveTicket")]
        public async Task<IActionResult> ActiveTicket(int page = 1, int pageSize = 5, string sortColumn = "LastUpdatedOn", string sortOrder = "DESC", string search = "")
        {
            try
            {

                // Fetch paginated and filtered tickets
                var allTickets = await _TicketManagerAdmin.GetActiveTickets(1, int.MaxValue, sortColumn, sortOrder, "");

                // Apply search filter if search keyword is provided
                if (!string.IsNullOrWhiteSpace(search))
                {
                    allTickets = allTickets
                        .Where(c => c.Title.Contains(search, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                // Map database model to view model
                var ticketModel = allTickets.Select(ticket => new TicketDetailAdminViewModel()
                {
                    RowNumber = ticket.RowNumber,
                    id = ticket.TicketID,
                    Title = ticket.Title,
                    Description = ticket.Description,
                    Priority = ((EnumServiceTicketPriority)ticket.Priority).ToString(),
                    RequestedBy = ticket.RequestedBy,
                    RequestedOn = ticket.RequestedOn,
                    TicketStatusID = ((EnumServiceTicketStatus)ticket.TicketStatusID).ToString(),
                    AssignedTo = ticket.AssignTo,
                    LastUpdatedOn = ticket.LastUpdatedOn
                }).ToList();

                // Calculate total pages (ensure this is consistent with the stored procedure)
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
                return ApiError($"Failed to retrieve services {ex}", statusCode: 500);
            }
        }
        [HttpGet("SettledTickets")]
        public async Task<IActionResult> Settledtickets(string search = "", string sortColumn = "LastUpdatedOn", string sortOrder = "DESC", int page = 1, int pageSize = 5)
        {
            try
            {
                var allTickets = await _TicketManagerAdmin.GetSettledTickets(1, int.MaxValue, sortColumn, sortOrder, "");

                // Apply search filter if search keyword is provided
                if (!string.IsNullOrWhiteSpace(search))
                {
                    allTickets = allTickets
                        .Where(c => c.Title.Contains(search, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                //create a list to store the TicketDetailView model objects
                List<TicketDetailViewModel> ticketModel = new List<TicketDetailViewModel>();

                //loop through all the objects form the database
                foreach (var ticket in allTickets)
                {
                    //create new model with the required fields and store in model
                    TicketDetailViewModel model = new TicketDetailViewModel()
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
                    };
                    // add the model to the object list 
                    ticketModel.Add(model);
                }

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
                return ApiError("Failed to retrieve services", statusCode: 500);
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
            };

            //return JSON of the ViewModel 
            return ApiResponse(ticket);
        }

        //--------------------------Delete Ticket by ID-------------------------

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ticketManager = new TicketManager();
            var ticket = await ticketManager.GetTicket(id);
            var currentTicketStatus = ticket.TicketStatusID;
            var isDeleted = await ticketManager.DeleteTicket(id);

            if (!isDeleted)
            {
                return ApiError("Ticket not found");
            }

            string remarks = "Ticket deleted";
            string action = "Delete";

            // var log = _logTicketManager.AddActivityLog(id,remarks,currentTicketStatus,action, GetUserName);

            return ApiResponse("Ticket deleted");
        }

        // // -------------------update ticket by id ---------------------------
        // [HttpPost("update")]
        // public async Task<IActionResult> Update([FromBody] TicketUpdateViewModel Model, int TicketID)
        // {
        //     var ticketManager = new TicketManager();
        //     var ticketManagerAdmin = new TicketManagerAdmin();
        //     
        //     var isTicketAvailable = await ticketManager.GetTicket(TicketID);
        //     
        //     if (isTicketAvailable == null)
        //     {
        //         return ApiError("Ticket not found");
        //     }
        //     
        //     var result = await ticketManagerAdmin.UpdateTicketStatus(TicketID,Model.Title,Model.Description, Model.TicketStatusID, Model.Remarks);
        //     return ApiResponse(result);
        // }

        [HttpPost("UpdateTicketStatus/{TicketID}")]
        public async Task<IActionResult> UpdateTicketStatus([FromRoute] int TicketID, [FromBody] int TicketStatusID)
        {
            var ticketManagerAdmin = new TicketManagerAdmin();

            var previousTicketStatus = ticketManagerAdmin.GetPreviousTicketStatusId(TicketID).Result;

            var result = await ticketManagerAdmin.UpdateTicketStatusIdAdmin(TicketID, TicketStatusID);

            string ticketStatusString = ((EnumServiceTicketStatus)TicketStatusID).ToString();
            string username = GetUserName ?? "Anonymous";

            var ticket = await _ticetManager.GetTicket(TicketID);

            if (!result)
            {
                return ApiError("Failed to update ticket status");
            }
            if (result)
            {
                var currentTicketStatus = TicketStatusID;

                string remarks = "Ticket Updated to " + ticketStatusString + " by " + username;
                string actionType = "Update";

                await _logTicketManager.AddActivityLog(TicketID, "Update of Ticket", remarks, previousTicketStatus, currentTicketStatus, username, actionType);
            }
            string notificationMessage = $"Your Ticket '{ticket.Title}' has been {ticketStatusString}.";
            await _notificationManager.AddNotificationAsync(notificationMessage, 1, ticket.RequestedBy);
            return ApiResponse("Ticket status updated");
        }

    }
}
