namespace TicketManagement.Models
{
    public class TicketViewModel
    {
        public string? Title { get; set; }
        public string? Description { get; set; } = null;
        public string? AssignTo { get; set; }
        public string? AssignedBy { get; set; }
    }
}
