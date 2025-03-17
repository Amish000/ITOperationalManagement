using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using WebApp.Models;

namespace ITAdministrationApp.Base
{
    [Authorize]
    public class AdminBaseController : Controller
    {
        protected string? GetUserName
        {
            get
            {
                return User?.Identity?.Name?.ToString();
            }
        }


        protected void ShowActionMessage(string message, eMessageType messageType)
        {
            TempData["SuccessMessage"] = message;
            TempData["MessageType"] = messageType.ToString();
        }
        protected List<string> GetModelStateError()
        {
            IEnumerable<ModelError> modelErrors = ModelState.Values.SelectMany(v => v.Errors);
            return modelErrors.Select(e => e.ErrorMessage).ToList();
        }
    }
}
