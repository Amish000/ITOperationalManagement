//using ITAdministrationApp.Areas.Admin.Controllers;
//using ITAdministrationApp.Areas.Admin.Models;
//using ITAdministrationApp.Models;

//using System.Collections.Generic;
//using System.Threading.Tasks;
//using TicketManagement.Models;
//namespace ITAdministrationApp.Services
//{
//    public class TicketService
//    {
//        private readonly LogTicketManager _logTicketManager;
//        private readonly TicketManager _ticketManager;

//        public TicketService(LogTicketManager logTicketManager, TicketManager ticketManager)
//        {
//            _logTicketManager = logTicketManager;
//            _ticketManager = ticketManager;
//        }

//        public async Task<List<LogTicketModel>> GetAllActivities(int start, int length, string search, string sortColumn, string sortOrder)
//        {
//            //var logTickets = new List<LogTicketModel>();
//            //return logTickets;
//            return await _logTicketManager.GetAllActivities(start, length, search, sortColumn, sortOrder);
//        }
//        public async Task<List<ServiceTicketModel>> GetAllTickets(int start, int length, string search)
//        {
//            return await _ticketManager.GetAllTickets(start, length, search);
//        }

//        //public async Task LogTicketActivity(int TicketID, int CurrentTicketStatusID, string Remarks, string AddedBy)
//        //{
//        //    await _logTicketManager.LogTicketActivity(TicketID, CurrentTicketStatusID, Remarks, AddedBy);
//        //}
//    }
//}

