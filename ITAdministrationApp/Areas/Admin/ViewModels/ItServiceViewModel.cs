namespace ITAdministrationApp.Areas.Admin.ViewModels
{
    public class ItServiceViewModel
    {
        public int RowNumber { get; set; }
        public int ServiceID { get; set; }
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
        public string BuyFrom { get; set; }
        public DateTime BuyDate { get; set; }
        public DateTime ExpiredOn { get; set; }
        public DateTime LastPaidDate { get; set; }
        public decimal? PaidAmount { get; set; }
        public string ServiceType { get; set; }
        public bool IsActive { get; set; }
        public DateTime UpdatedOn { get; set; }
        public decimal TotalPaidAmount { get; set; }
    }
}