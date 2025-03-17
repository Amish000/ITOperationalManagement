namespace ITAdministrationApp.Areas.Admin.ViewModels;

public class ServicePaymentAddViewModel
{
    public int ServiceID { get; set; }
    public decimal PaidAmount { get; set; }
    public string AddedBy { get; set; }
    public string PaidBy { get; set; }
    public string Remarks { get; set; }

}