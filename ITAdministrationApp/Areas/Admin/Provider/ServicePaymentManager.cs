//using Common.Lib;
//using ITAdministrationApp.Areas.Admin.Models;
//using SQLHelper;
//using System.Collections.Generic;
//using System.Data;
//using System.Threading.Tasks;

//namespace ITAdministrationApp.Areas.Admin.Provider
//{
//    public class ServicePaymentManager
//    {
//        public async Task<List<ServicePaymentModel>> GetAllServicesPayment(int offset, int limit, string searchKeyword = "", string sortColumn = "LogID", string sortOrder = "ASC")
//        {
//            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
//            IList<KeyValue> param = new List<KeyValue>
//            {
//                new KeyValue("@Offset", offset),
//                new KeyValue("@Limit", limit),
//                new KeyValue("@searchKeyword", searchKeyword),
//                new KeyValue("@SortColumn", sortColumn),
//                new KeyValue("@SortOrder", sortOrder)
//            };
//            var payments = await sqlHelper.ExecuteAsListAsync<ServicePaymentModel>("[dbo].[GetAllServicePayments]", param);
//            return payments;
//        }

//        public async Task<OperationResponse<string>> AddPayment(ServicePaymentAddModel model, string username)
//        {
//            OperationResponse<string> response = new OperationResponse<string>();
//            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
//            IList<KeyValue> param = new List<KeyValue>();

//            param.Add(new KeyValue("@LogID", model.LogID));
//            param.Add(new KeyValue("@ServiceID", model.ServiceID));
//            param.Add(new KeyValue("@PaidAmount", model.PaidAmount));
//            //param.Add(new KeyValue("@LastPaid", model.LastPaidDate));
//            //param.Add(new KeyValue("@AddedBy", model.AddedBy));
//            //param.Add(new KeyValue("@AddedOn", model.AddedOn));
//            //param.Add(new KeyValue("@UpdatedBy", model.UpdatedBy));
//            //param.Add(new KeyValue("@UpdatedOn", model.UpdatedOn));
//            param.Add(new KeyValue("@IsActive", model.IsActive));
//            param.Add(new KeyValue("@IsDeleted", model.IsDeleted));
//            param.Add(new KeyValue("@PaidBy", model.PaidBy));
//            param.Add(new KeyValue("@Remarks", model.Remarks));
//            param.Add(new KeyValue("@CurrentUsername", username));
//            //param.Add(new KeyValue("@DeletedOn", model.DeletedOn));
//            //param.Add(new KeyValue("@DeletedBy", model.DeletedBy));
//            // Removed DeletedOn and DeletedBy from the parameters since they're not used for adding

//            int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[AddPayment]", param, "@OpStatus");
//            response.Result = model.LogID == 0 ? "Payment Created Successfully !" : "Payment Updated Successfully !";
//            return response;

//        }
//        public async Task<ServicePaymentModel> GetPaymentID(int id)
//        {
//            SQLHandlerAsync handlerAsync = new SQLHandlerAsync();
//            IList<KeyValue> param = new List<KeyValue>();
//            param.Add(new KeyValue("@LogID", id));
//            var datamodel = await handlerAsync.ExecuteAsObjectAsync<ServicePaymentModel>("[dbo].[GetServicePaymentID]", param);
//            return datamodel;
//        }

//        public async Task<OperationResponse<string>> Delete(int id)
//        {
//            OperationResponse<string> response = new OperationResponse<string>();
//            SQLHandlerAsync handlerAsync = new SQLHandlerAsync();
//            IList<KeyValue> param = new List<KeyValue>();
//            param.Add(new KeyValue("@LogID", id));
//            await handlerAsync.ExecuteNonQueryAsync("[dbo].[DeleteServicePayment]", param);
//            response.Result = "Deleted suucessfully!";
//            return response;
//        }
//



//    }

//}

using ITAdministrationApp.Areas.Admin.Models;
using ITAdministrationApp.Areas.Admin.ViewModels;
using SQLHelper;

namespace ITAdministrationApp.Areas.Admin.Provider
{
    public class ServicePaymentManager
    {
        public async Task<List<ServicePaymentModel>> GetAllServicePayments(int serviceID, int offset, int limit, string searchKeyword = "", string sortColumn = "LogID", string sortOrder = "ASC")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>
            {
                new KeyValue("@ServiceID", serviceID),
                new KeyValue("@Offset", offset),
                new KeyValue("@Limit", limit),
                new KeyValue("@searchKeyword", searchKeyword),
                new KeyValue("@SortColumn", sortColumn),
                new KeyValue("@SortOrder", sortOrder)
            };
            var payments = await sqlHelper.ExecuteAsListAsync<ServicePaymentModel>("[dbo].[GetAllServicePayments]", param);
            return payments;
        }

        public async Task<OperationResponse<string>> AddPayment(ServicePaymentAddViewModel model)
        {
            OperationResponse<string> response = new OperationResponse<string>();
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();


            param.Add(new KeyValue("@ServiceID", model.ServiceID));
            param.Add(new KeyValue("@PaidAmount", model.PaidAmount));
            //param.Add(new KeyValue("@LastPaid", model.LastPaidDate));
            param.Add(new KeyValue("@AddedBy", model.AddedBy));
            //param.Add(new KeyValue("@AddedOn", model.AddedOn));
            //param.Add(new KeyValue("@UpdatedBy", model.UpdatedBy));
            //param.Add(new KeyValue("@UpdatedOn", model.UpdatedOn));
            //param.Add(new KeyValue("@AddedBy", username));
            //param.Add(new KeyValue("@IsActive", model.IsActive));
            //param.Add(new KeyValue("@IsDeleted", model.IsDeleted));
            param.Add(new KeyValue("@PaidBy", model.PaidBy));
            param.Add(new KeyValue("@Remarks", model.Remarks));

            //param.Add(new KeyValue("@Vendor", model.Vendor));
            //param.Add(new KeyValue("@DeletedOn", model.DeletedOn));
            //param.Add(new KeyValue("@DeletedBy", model.DeletedBy));
            // Removed DeletedOn and DeletedBy from the parameters since they're not used for adding

            int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[AddPayment]", param, "@OpStatus");
            response.Result = opStatus == 0 ? response.Result = "Payment not created Successfully!" : response.Result = "Payment Created Successfully !";
            //inserted today:following
            return response;

        }

        public async Task<ServicePaymentModel> GetPaymentID(int id)
        {
            SQLHandlerAsync handlerAsync = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();
            param.Add(new KeyValue("@LogID", id));
            var datamodel = await handlerAsync.ExecuteAsObjectAsync<ServicePaymentModel>("[dbo].[GetServicePaymentID]", param);
            return datamodel;
        }

        public async Task<OperationResponse<string>> Delete(int id)
        {
            OperationResponse<string> response = new OperationResponse<string>();
            SQLHandlerAsync handlerAsync = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();
            param.Add(new KeyValue("@LogID", id));
            await handlerAsync.ExecuteNonQueryAsync("[dbo].[DeleteServicePayment]", param);
            response.Result = "Deleted suucessfully!";
            return response;
        }

        //added today friday
        //public async Task<OperationResponse<string>> UpdateServiceAfterPayment(int serviceID, decimal paidAmount, DateTime lastPaidDate)
        //{
        //    OperationResponse<string> response = new OperationResponse<string>();
        //    SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
        //    IList<KeyValue> param = new List<KeyValue>();

        //    param.Add(new KeyValue("@ServiceID", serviceID));
        //    param.Add(new KeyValue("@PaidAmount", paidAmount));
        //    param.Add(new KeyValue("@LastPaidDate", lastPaidDate));

        //    int opStatus = await sqlHelper.ExecuteNonQueryAsync("[dbo].[UpdateServiceAfterPayment]", param, "@OpStatus");
        //    response.Result = opStatus == 0 ? "Service Updated Succesfully!" : "Failed to Update";
        //    return response;
        //}


    }
}


