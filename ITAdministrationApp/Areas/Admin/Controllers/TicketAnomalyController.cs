using ITAdministrationApp.Services;
using Microsoft.AspNetCore.Mvc;
using static ITAdministrationApp.Models.TicketAnomaly;
namespace ITAdministrationApp.Areas.Admin.Controllers
{
    [Area("admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketAnomalyController : ControllerBase
    {
        private readonly TicketClassificationService _ticketClassificationService;
        private readonly TicketManager _ticketManager;

        public TicketAnomalyController(TicketClassificationService ticketclassificationService, TicketManager ticketManager)
        {
            _ticketClassificationService = ticketclassificationService;
            _ticketManager = ticketManager;
        }

        [HttpPost("TrainAnomalyModel")]
        public async Task<IActionResult> TrainAnomalyModel()
        {
            var tickets = await _ticketManager.GetAllTickets(1, 500, "TicketID", "ASC");

            var descriptions = tickets.Select(t => new TicketDescription
            {
                Description = t.Description, // Make sure this exists in your Ticket model
            }).ToList();

            _ticketClassificationService.TrainModel(descriptions);

            return Ok(new { message = "Anomaly model trained successfully." });
        }


        [HttpPost("DetectAnomalies")]
        public IActionResult DetectAnomalies([FromBody] List<string> ticketDescriptions)
        {
            // Predict categories for each description in the request
            var anomalies = ticketDescriptions.Select(description =>
            {
                var category = _ticketClassificationService.PredictCluster(description);
                return new { 
                    TicketDescription = description, 
                    PredictedCategory = category };
            }).ToList();

            return Ok(new
            {
                result = anomalies
            });
        }

    }

}
