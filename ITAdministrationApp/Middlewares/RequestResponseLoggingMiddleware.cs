namespace ITAdministrationApp.Middlewares
{
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

        public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            // Request logging
            _logger.LogInformation("Incoming request: {Method} {Url}", httpContext.Request.Method, httpContext.Request.Path);

            // Capture the response by setting up a temporary stream
            var originalResponseBody = httpContext.Response.Body;
            using (var newResponseBody = new MemoryStream())
            {
                httpContext.Response.Body = newResponseBody;

                // Call the next middleware in the pipeline
                await _next(httpContext);

                // Response logging
                _logger.LogInformation("Outgoing response: {StatusCode}", httpContext.Response.StatusCode);

                // After the response is generated, we can modify it
                // Example: add custom headers to the response
                httpContext.Response.Headers.Add("X-Custom-Header", "This is a custom header!");

                // Copy the content from the new stream to the original response body
                await newResponseBody.CopyToAsync(originalResponseBody);
            }
        }
    }

}
