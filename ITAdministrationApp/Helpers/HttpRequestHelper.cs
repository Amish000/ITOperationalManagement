using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ITAdministrationApp.Helpers
{
    public static class HttpRequestHelper
    {
        public static async Task<ContentResult> GetContentResultAsync(string rootPath, HttpStatusCode statusCode, string title, string message)
        {
            string errorPage = string.Join(Environment.NewLine, await System.IO.File.ReadAllLinesAsync(System.IO.Path.Combine(rootPath, "Resources", "ErrorPage.html")));
            errorPage = errorPage.Replace("{Title}", title);
            errorPage = errorPage.Replace("{Message}", message);
            errorPage = errorPage.Replace("{StatusCode}", ((int)statusCode).ToString());
            return new ContentResult
            {
                ContentType = "text/html",
                StatusCode = (int)HttpStatusCode.OK,
                Content = errorPage
            };
        }

        public static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }

            return "localhost";
        }

    }
}
