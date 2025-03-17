
using ITAdministrationApp.Areas.Admin.Models;
using ITAdministrationApp.Areas.Admin.Provider;
using ITAdministrationApp.Areas.Admin.ViewModels;
using ITAdministrationApp.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;
using ITAdministrationApp.Controllers;

namespace ITAdministrationApp.Areas.Admin.Controllers;

[Area("admin")]
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServicePaymentController : ApiControllerBase
{
    private readonly IWebHostEnvironment _hostingEnvironment;
    private readonly ServicePaymentManager _servicePaymentManager;

    public ServicePaymentController(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
        _servicePaymentManager = new ServicePaymentManager();
    }

    [HttpGet("Index")]
    public async Task<IActionResult> Index(int serviceID, string search = "", string sortColumn = "LogID", string sortOrder = "ASC", int page = 1, int pageSize = 5)
    {
        //var offset = (page - 1) * pageSize;
        var allPayments = await _servicePaymentManager.GetAllServicePayments(serviceID, 0, int.MaxValue, /*offset,*/ "", /*pageSize, search,*/ sortColumn, sortOrder);

        if (!string.IsNullOrWhiteSpace(search))
        {
            allPayments = allPayments
                .Where(p => p.PaidBy.Contains(search, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        var totalItems = allPayments.Count();
        //calculate total pages
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
        var paginatedPayments = allPayments.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return ApiResponse(new
        {
            payments = paginatedPayments,
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


    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] ServicePaymentAddViewModel model)
    {

        //if (ModelState.IsValid)
        //{
        var result = await _servicePaymentManager.AddPayment(model);


        ////Update After Payment today
        //var serviceUpdateResult = await _servicePaymentManager.UpdateServiceAfterPayment(serviceID, model.PaidAmount, DateTime.Now);

        if (result != null)
        {
            return ApiResponse(result);
        }
        //ShowActionMessage(string.Join(",", result.ErrorMessage), eMessageType.danger);
        return ApiError("Service was not created");

        //}
        //ViewBag.ServiceID = serviceID;

    }
    [HttpPost("Delete")]
    public async Task<IActionResult> Delete(int id, int serviceID)
    {
        ServicePaymentManager manager = new();
        var result = await manager.Delete(id);

        if (result.IsSucess)
        {
            //ShowActionMessage(result.Result, eMessageType.success);
            return RedirectToAction(nameof(Index), new { serviceID });
        }

        else
        {
            // Deletion failed
            ModelState.AddModelError(string.Empty, "Failed to delete payment.");
            // You might want to handle this error differently, such as displaying a message to the user.
            return RedirectToAction(nameof(Index), new { serviceID });
        }
        //var response = await manager.GetAllServicePayments( serviceID, 0, 10, "");
        ////return View(nameof(Index), response);
        //return RedirectToAction(nameof(Index), new { serviceID });
    }
}
