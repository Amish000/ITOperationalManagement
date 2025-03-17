namespace ITAdministrationApp.Areas.Admin.Models
{
    public class ServicePaymentAddModel
    {
        public int LogID { get; set; }
        public int ServiceID { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime? LastPaidDate { get; set; }
        public string AddedBy { get; set; }
        public DateTime AddedOn { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public string PaidBy { get; set; }
        public string Vendor { get; set; }
        public string Remarks { get; set; }
        public DateTime? DeletedOn { get; set; }
        public string DeletedBy { get; set; }
    }
}