using ITAdministrationApp.Areas.Admin.Models;
using ITAdministrationApp.Areas.Admin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using SQLHelper;
namespace ITAdministrationApp.Areas.Admin.Provider
{
    public class ITServiceManager
    {
        public async Task<List<ItServiceViewModel>> GetAllServices(int offset, int limit, string searchKeyword = "", string sortColumn = "ExpiredOn", string sortOrder = "DESC")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                new KeyValue("@Offset", offset),
                new KeyValue("@Limit", limit),
                new KeyValue("@searchKeyword", searchKeyword),
                new KeyValue("@SortColumn", sortColumn),
                new KeyValue("@SortOrder", sortOrder)
            };
            var thelist = await sqlHelper.ExecuteAsListAsync<ItServiceViewModel>("[dbo].[GetAllITServices]", param);
            return thelist;
        }

        public async Task<List<ItServiceViewModel>> GetActiveService(int offset, int limit, string searchKeyword = "", string sortColumn = "ExpiredOn", string sortOrder = "DESC")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                new KeyValue("@PageNumber", offset),
                new KeyValue("@Limit", limit),
                new KeyValue("@searchKeyword", searchKeyword),
                new KeyValue("@SortColumn", sortColumn),
                new KeyValue("@SortOrder", sortOrder)
            };
            var thelist = await sqlHelper.ExecuteAsListAsync<ItServiceViewModel>("[dbo].[ups_ITServices_GetActive]", param);
            return thelist;
        }

        public async Task<List<ItServiceViewModel>> GetExpiredService(int offset, int limit, string searchKeyword = "", string sortColumn = "ExpiredOn", string sortOrder = "DESC")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                new KeyValue("@PageNumber", offset),
                new KeyValue("@Limit", limit),
                new KeyValue("@searchKeyword", searchKeyword),
                new KeyValue("@SortColumn", sortColumn),
                new KeyValue("@SortOrder", sortOrder)
            };
            var thelist = await sqlHelper.ExecuteAsListAsync<ItServiceViewModel>("[dbo].[ups_ITServices_GetExpired]", param);
            return thelist;
        }

        public async Task<OperationResponse<string>> Add(ItServiceCreateViewModel model, string username)
        {
            OperationResponse<string> response = new OperationResponse<string>();
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();

            // param.Add(new KeyValue("@ServiceID", model.ServiceID));
            param.Add(new KeyValue("@ServiceName", model.ServiceName));
            param.Add(new KeyValue("@ServiceDescription", model.ServiceDescription));
            param.Add(new KeyValue("@BuyFrom", model.BuyFrom));
            //param.Add(new KeyValue("@BuyDate", model.BuyDate));
            param.Add(new KeyValue("@ExpiresOn", model.ExpiresOn));
            //param.Add(new KeyValue("@LastPaidDate", model.LastPaidDate));
            param.Add(new KeyValue("@PaidAmount", model.PaidAmount));
            //param.Add(new KeyValue("@UsedInDomains", model.UsedInDomains));
            param.Add(new KeyValue("@ServiceType", model.ServiceType));
            param.Add(new KeyValue("@AddedBy", username));
            //param.Add(new KeyValue("@IsActive", model.IsActive));
            //param.Add(new KeyValue("@IsDeleted", model.IsDeleted));
            //param.Add(new KeyValue("@PayStatus", model.ItStatus));
            // Removed DeletedOn and DeletedBy from the parameters since they're not used for updates

            int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[CreateITServices]", param, "@OpStatus");
            if (opStatus > 1)
            {
                response.Result = "Service Created Successfully";
            }
            else
            {
                response.Result = ("Service not Created");
            }
            return response;
        }

        public async Task<OperationResponse<string>> Update(ItServiceCreateViewModel model, string username, [FromRoute] int id)
        {
            OperationResponse<string> response = new OperationResponse<string>();
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();
            param.Add(new KeyValue("@ServiceId", id));
            param.Add(new KeyValue("@ServiceName", model.ServiceName));
            param.Add(new KeyValue("@ServiceDescription", model.ServiceDescription));
            param.Add(new KeyValue("@BuyFrom", model.BuyFrom));
            //param.Add(new KeyValue("@BuyDate", model.BuyDate));
            param.Add(new KeyValue("@ExpiresOn", model.ExpiresOn));
            //param.Add(new KeyValue("@LastPaidDate", model.LastPaidDate));
            param.Add(new KeyValue("@PaidAmount", model.PaidAmount.HasValue ? (object)model.PaidAmount.Value : DBNull.Value));
            //param.Add(new KeyValue("@UsedInDomains", model.UsedInDomains));ß
            param.Add(new KeyValue("@ServiceType", model.ServiceType));
            param.Add(new KeyValue("@AddedBy", username));
            try
            {
                // Execute the stored procedure and get the status
                int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[UpdateITService]", param, "@OpStatus");

                // Handle the operation result based on opStatus
                if (opStatus == 0)
                {
                    response.Result = "Service is not available";
                }
                else if (opStatus == 1)
                {
                    response.Result = "Service was updated successfully";
                }
                else
                {
                    response.Result = "An error occurred while updating the service";
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during execution
                response.Result = $"Error: {ex.Message}";
            }

            return response;
        }

        public async Task<ItServiceShowServiceIDDetailViewModel> GetServiceById(int id)
        {
            SQLHandlerAsync handlerAsync = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();
            param.Add(new KeyValue("@ServiceID", id));
            var datamodel = await handlerAsync.ExecuteAsObjectAsync<ItServiceShowServiceIDDetailViewModel>("[dbo].[GetITServiceByID]", param);
            return datamodel;
        }

        public async Task<bool> Delete(int id)
        {
            SQLHandlerAsync handlerAsync = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();
            param.Add(new KeyValue("@id", id));

            int result = await handlerAsync.ExecuteAsScalarAsync<int>("[dbo].[usp_ITService_Delete]", param);

            return result > 0;
        }

        //can be deleted
        public async Task<OperationResponse<string>> UpdateServicePaymentInfo(int serviceID, decimal paidAmount, bool isactive /*, string vendor*/ /*, DateTime? lastPaidDate*/)
        {
            OperationResponse<string> response = new OperationResponse<string>();
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();


            param.Add(new KeyValue("@ServiceID", serviceID));
            param.Add(new KeyValue("@PaidAmount", paidAmount));
            //for status
            param.Add(new KeyValue("@IsActive", isactive));
            //param.Add(new KeyValue("@Vendor", vendor));
            //new KeyValue("@LastPaidDate", lastPaidDate)


            int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[UpdateServicePaymentInfo]", param, "@OpStatus");
            response.Result = opStatus == 0 ? "Service Payment not updated!" : "Service Payment Updated Successfully !"; // Corrected success message
            return response;
        }

        public async Task<OperationResponse<string>> ExtendItService(ItServiceExtendDurationViewModel model, int id)
        {
            OperationResponse<string> response = new OperationResponse<string>();
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();
            param.Add(new KeyValue("@ServiceID", id));
            param.Add(new KeyValue("@ExtendedMonths", model.ExtendedMonths));
            param.Add(new KeyValue("@PaidAmount", model.PaidAmount));

            try
            {
                int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[usp_ITService_Extend]", param, "@OpStatus");
                response.Result = opStatus == 1 ? "Service Extending Successfully!" : "Service Extending Failed!";
            }
            catch (Exception ex)
            {
                response.Result = $"An error occurred: {ex.Message}";
            }
            return response;

        }

    }
}
