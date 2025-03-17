using Azure;
using ITAdministrationApp.Areas.Admin.Models;
using ITAdministrationApp.Areas.Admin.Provider;
using ITAdministrationApp.Areas.Admin.ViewModels;
using ITAdministrationApp.Base;
using ITAdministrationApp.Controllers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;
using WebApp.Models;

namespace ITAdministrationApp.Areas.Admin;

[Area("Admin")]
[Route("api/[area]/[controller]")]
[ApiController]
[Authorize]
public class ItServiceController : ApiControllerBase
{
    private readonly IWebHostEnvironment _hostingEnvironment;
    private readonly ITServiceManager _serviceManager;

    public ItServiceController(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
        _serviceManager = new ITServiceManager();
    }
    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("Index")]
    public async Task<IActionResult> Index(string search = "", string sortColumn = "ExpiredOn", string sortOrder = "DESC", int page = 1, int pageSize = 5)
    {
        try
        {
            // Fetch all services without applying search filter
            var allServices = await _serviceManager.GetAllServices(0, int.MaxValue, "", sortColumn, sortOrder);

            // Apply search filter if search keyword is provided
            if (!string.IsNullOrWhiteSpace(search))
            {
                allServices = allServices
                    .Where(c => c.ServiceName.Contains(search, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            // Count total number of items
            var totalItems = allServices.Count();

            // Apply pagination
            var paginatedServices = allServices.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            // Calculate total pages
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

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
        catch (Exception)
        {
            return ApiError("Failed to retrieve services", statusCode: 500);
        }
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("GetActiveServices")]
    public async Task<IActionResult> GetActiveServices(string search = "", string sortColumn = "ExpiredOn", string sortOrder = "ASC", int page = 1, int pageSize = 5)
    {
        try
        {
            // Fetch all services without applying search filter
            var allServices = await _serviceManager.GetActiveService(1, int.MaxValue, "", sortColumn, sortOrder);


            // Apply search filter if search keyword is provided
            if (!string.IsNullOrWhiteSpace(search))
            {
                allServices = allServices
                    .Where(c => c.ServiceName.Contains(search, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            // Count total number of items

            var totalItems = allServices.Count();

            // Apply pagination
            var paginatedServices = allServices.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            // Calculate total pages
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

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
        catch (Exception e)
        {
            return ApiError("Failed to retrieve services ", statusCode: 500);
        }
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("GetExpiredServices")]
    public async Task<IActionResult> GetExpiredServices(string search = "", string sortColumn = "ExpiredOn", string sortOrder = "DESC", int page = 1, int pageSize = 5)
    {
        try
        {
            // Fetch all services without applying search filter
            var allServices = await _serviceManager.GetExpiredService(page, pageSize, search, sortColumn, sortOrder);

            // Apply search filter if search keyword is provided
            if (!string.IsNullOrWhiteSpace(search))
            {
                allServices = allServices
                    .Where(c => c.ServiceName.Contains(search, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            // Count total number of items
            var totalItems = allServices.Count();

            // Apply pagination
            var paginatedServices = allServices.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            // Calculate total pages
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

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
        catch (Exception e)
        {
            return ApiError("Failed to retrieve services", statusCode: 500);
        }
    }

    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] ItServiceCreateViewModel model)
    {

        try
        {
            var username = GetUserName ?? "StaticUser";
            if (!ModelState.IsValid)
                return ValidationError();

            var result = await _serviceManager.Add(model, username);

            if (result.IsSucess)
            {
                return ApiResponse("Service created successfully");
            }

            return ApiError("Failed to create service");
        }
        catch (Exception ex)
        {

            return ApiError("Internal server error ", statusCode: 500);
        }
    }

    [HttpPost("Update/{id}")]

    public async Task<IActionResult> Edit([FromBody] ItServiceCreateViewModel model, [FromRoute] int id)
    {

        try
        {
            var username = GetUserName ?? "StaticUser";

            if (!ModelState.IsValid)
                return ValidationError();

            var result = await _serviceManager.Update(model, username, id);

            if (result.IsSucess)
            {
                return ApiResponse("Service updated successfully");
            }

            return ApiError(result.ResultMessage);
        }
        catch (Exception ex)
        {
            return ApiError("Internal server error ", statusCode: 500);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetServiceById(int id)
    {
        var model = await _serviceManager.GetServiceById(id);
        if (model == null)
        {
            return ApiError("Service not found");
        }

        var service = new ItServiceShowServiceIDDetailViewModel
        {
            ServiceID = model.ServiceID,
            ServiceName = model.ServiceName,
            ServiceDescription = model.ServiceDescription,
            BuyFrom = model.BuyFrom,
            BuyDate = model.BuyDate,
            ExpiredOn = model.ExpiredOn,
            LastPaidDate = model.LastPaidDate,
            PaidAmount = model.PaidAmount,
            UsedInDomains = model.UsedInDomains,
            ServiceType = model.ServiceType,
            IsActive = model.IsActive,
            IsDeleted = model.IsDeleted,
            TotalPaidAmount = model.TotalPaidAmount
        };
        return ApiResponse(service, "Service retrieved successfully");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        try
        {
            var result = await _serviceManager.Delete(id);

            if (result)
            {
                return ApiResponse(result, "Service deleted successfully");
            }
            return ApiError("Failed to delete service");
        }
        catch (Exception ex)
        {
            return ApiError("Internal server error ", statusCode: 500);
        }
    }

    [HttpPost("UpdateExpiryDate/{id}")]
    public async Task<IActionResult> SetExpiryDate(ItServiceExtendDurationViewModel model, [FromRoute] int id)
    {
        var result = await _serviceManager.ExtendItService(model, id);
        if (result.IsSucess)
        {
            return ApiResponse("Service updated successfully");
        }
        return ApiError(result.ResultMessage ?? "Failed to update service");
    }


    [HttpGet("Payments")]
    public IActionResult ViewPayment(int serviceID)
    {
        try
        {
            return ApiResponse(new { serviceID }, "Service payment view loaded");
        }
        catch (Exception ex)
        {
            return ApiError("Failed to load service payment view ", statusCode: 500);
        }
    }
}