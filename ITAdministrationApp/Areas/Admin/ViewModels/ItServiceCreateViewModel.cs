namespace ITAdministrationApp.Areas.Admin.ViewModels
{
    public class ItServiceCreateViewModel
    {
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
        public string BuyFrom { get; set; }
        public decimal? PaidAmount { get; set; }
        public DateTime ExpiresOn { get; set; }
        public string ServiceType { get; set; }
    }
}
