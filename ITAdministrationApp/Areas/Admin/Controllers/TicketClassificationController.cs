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

        [HttpPost("PredictCategory")]
        public IActionResult PredictCategory([FromBody] List<string> ticketDescriptions)
        {
            if (ticketDescriptions == null || !ticketDescriptions.Any())
            {
                return BadRequest(new { message = "Invalid request: No ticket descriptions provided." });
            }

            var anomalies = ticketDescriptions.Select(description =>
            {
                var category = _ticketClassificationService.PredictTicketCategory(description);
                return new
                {
                    TicketDescription = description,
                    PredictedCategory = category
                };
            }).ToList();

            return Ok(new { result = anomalies });
        }
    }
}
