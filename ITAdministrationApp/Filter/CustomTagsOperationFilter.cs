using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ITAdministrationApp.Filter
{
    public class CustomTagsOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var controllerName = context.ApiDescription.ActionDescriptor.RouteValues["controller"];

            // Add a tag for the controller name
            operation.Tags = [new OpenApiTag { Name = controllerName }];
        }
    }
}
