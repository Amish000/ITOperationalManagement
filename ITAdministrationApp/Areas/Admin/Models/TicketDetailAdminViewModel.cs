namespace ITAdministrationApp.Areas.Admin.Models;

public class TicketDetailAdminViewModel
{
    public int RowNumber { get; set; }
    public int id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    public string Priority { get; set; }
    public string RequestedBy { get; set; }
    public DateTime? RequestedOn { get; set; }
    public string TicketStatusID { get; set; }

    public string AssignedTo { get; set; }
    public string AssignedBy { get; set; }
    public DateTime LastUpdatedOn { get; set; }
}