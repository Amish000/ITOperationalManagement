namespace ITAdministrationApp.Areas.Admin.Models
{
    public class ServiceTicketActivityLog
    {
        public int LogID { get; set; }
        public int TicketID { get; set; }
        public int PrevTicketStatusID { get; set; }
        public int CurrentTicketStatusID { get; set; }
        public DateTime AddedOn { get; set; }
        public string AddedBy { get; set; }
    }
}
