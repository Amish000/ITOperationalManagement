namespace ITAdministrationApp.Areas.Admin.Models
{
    public class ItServiceShowServiceIDDetailViewModel
    {
        public int ServiceID { get; set; }
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
        public string BuyFrom { get; set; }
        public DateTime BuyDate { get; set; }
        public DateTime ExpiredOn { get; set; } // Nullable for services without expiry
        public DateTime LastPaidDate { get; set; } // Nullable for services without recurring payments
        public decimal? PaidAmount { get; set; }
        public string UsedInDomains { get; set; }
        public string ServiceType { get; set; }
        public bool IsActive { get; set; } = true; // Set default value to active
        public bool IsDeleted { get; set; } = false; // Set default value to not deleted
        public decimal TotalPaidAmount { get; set; }

        //public bool ItStatus { get; set; } = false;
        // No AddedBy, AddedOn, DeletedBy, DeletedOn, UpdatedBy, UpdatedOn
    }
}
