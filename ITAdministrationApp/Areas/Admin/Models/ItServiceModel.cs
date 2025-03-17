namespace ITAdministrationApp.Areas.Admin.Models
{
    public class ItServiceModel
    {
        public int RowNumber { get; set; }
        public int ServiceID { get; set; }
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
        public string BuyFrom { get; set; }
        public DateTime? BuyDate { get; set; } // Nullable for flexibility
        public DateTime? ExpiredOn { get; set; } // Nullable for services without expiry
        public DateTime? LastPaidDate { get; set; } // Nullable for services without recurring payments
        public decimal? PaidAmount { get; set; }
        public string UsedInDomains { get; set; }
        public string ServiceType { get; set; }
        public string AddedBy { get; set; }
        public DateTime AddedOn { get; set; } = DateTime.UtcNow; // Set default value to current UTC time
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; } // Nullable for cases where updates haven't occurred
        public bool IsActive { get; set; } = true; // Set default value to active
        public bool IsDeleted { get; set; } = false; // Set default value to not deleted
        public DateTime? DeletedOn { get; set; }// Nullable for non-deleted services
        public string? DeletedBy { get; set; } // Nullable for non-deleted services
        public decimal TotalPaidAmount { get; set; }

        /*public bool ItStatus { get; set; } = false;*/ //added just now to check payment status as pending and paid


    }
}