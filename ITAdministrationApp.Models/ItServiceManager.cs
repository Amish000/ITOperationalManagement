using ITAdministrationApp.Models.Models;
using SQLHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ITAdministrationApp.Models
{
    public class ItServiceManager
    {
        public async Task<List<ItServiceModel>> GetAllServices(int offset, int limit, string searchKeyword = "")
        {
            SQLHandlerAsync sqlHelper = new SQLHandlerAsync();
            IList<KeyValue> param = new List<KeyValue>();
            param.Add(new KeyValue("@Offset", offset));
            param.Add(new KeyValue("@Limit", limit));
            param.Add(new KeyValue("@searchKeyword", searchKeyword));
            var thelist = await sqlHelper.ExecuteAsListAsync<ItServiceModel>("[dbo].[GetAllITServices]", param);
            return thelist;
        }
    }
}
