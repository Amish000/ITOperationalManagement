using ITAdministrationApp.Services;
using ITAdministrationApp;
using Microsoft.AspNetCore.Mvc;
using static ITAdministrationApp.Models.TicketAnomaly;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAdministrationApp.Areas.Admin.Controllers
{
    [Area("admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketClassificationController : ControllerBase
    {
        private readonly TicketClassificationService _ticketClassificationService;

        public TicketClassificationController(TicketClassificationService ticketClassificationService)
        {
            _ticketClassificationService = ticketClassificationService;
        }
        [HttpPost("TrainModel")]
        public async Task<IActionResult> TrainModel()
        {
            await Task.Run(() => _ticketClassificationService.TrainModel());

            return Ok(new { message = "Anomaly model trained successfully." });
        }

        [HttpGet("PredictCategory")]
        public IActionResult PredictCategory([FromQuery] string ticketDescription)
        {
            if (string.IsNullOrEmpty(ticketDescription))
            {
                return BadRequest(new { message = "Invalid request: No ticket description provided." });
            }

            var category = _ticketClassificationService.PredictTicketCategory(ticketDescription);

            var result = new
            {
                TicketDescription = ticketDescription,
                PredictedCategory = category
            };

            return Ok(result);
        }
    }
}
