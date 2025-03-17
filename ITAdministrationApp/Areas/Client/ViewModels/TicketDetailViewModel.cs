// A view model to show only the desired details to the User
namespace Common.Lib.Areas.Client.ViewModels;

public class TicketDetailViewModel
{
    public int RowNumber { get; set; }
    public int id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    
    public string Priority { get; set; }
    public string RequestedBy { get; set; }
    public DateTime? RequestedOn { get; set; }
    public string TicketStatusId { get; set; }
    
    public string AssignedTo { get; set; }
    public DateTime LastUpdatedOn { get; set; }
}