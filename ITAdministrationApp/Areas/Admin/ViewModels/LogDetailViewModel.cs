namespace ITAdministrationApp.Areas.Admin.ViewModels;

public class LogDetailViewModel
{
    public int RowNumber { get; set; }
    public int LogID { get; set; }
    public int TicketID { get; set; }
    public string Title { get; set; }

    public string ServiceTicketTitle { get; set; }   //Title form ServiceTicket

    public string PrevTicketStatusID { get; set; }
    public string CurrentTicketStatusID { get; set; }

    public DateTime ActionOn { get; set; }

    public string ActionBy { get; set; }
    public string Remarks { get; set; }
    public string ActionType { get; set; }
}