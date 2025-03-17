using ITAdministrationApp.Data;
using ITAdministrationApp.Filter;
using ITAdministrationApp.Middlewares;
using Microsoft.AspNetCore.Identity;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using SQLHelper;
using ITAdministrationApp.Models;
using ITAdministrationApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
// builder.Services.AddDbContext<IdentityDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.SignIn.RequireConfirmedEmail = true;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddSingleton<TicketManager>(); // Register TicketManager as singleton
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

//Add CORS policy 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3000", "http://it.braindigit.com") // React app origin
                .AllowAnyMethod() // Allow all HTTP methods (GET, POST, etc.)
                .AllowAnyHeader() // Allow all headers
                .AllowCredentials(); // Allow cookies/credentials if needed
        });
});

// Add JWT Configuration
var jwtConfig = builder.Configuration.GetSection("Jwt").Get<JwtConfig>();
builder.Services.AddSingleton(jwtConfig);
builder.Services.AddScoped<IJwtService, JwtService>();

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtConfig.Issuer,
        ValidAudience = jwtConfig.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Secret)),
        RoleClaimType = ClaimTypes.Role
    };
});

// Add Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SuperAdminOnly", policy =>
        policy.RequireRole("SuperAdmin"));

    options.AddPolicy("AdminAndAbove", policy =>
        policy.RequireRole("Admin", "SuperAdmin"));

    options.AddPolicy("AllUsers", policy =>
        policy.RequireRole("User", "Admin", "SuperAdmin"));

    // Fallback policy - require authentication by default
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

//builder.Services.Configure<IdentityOptions>(opts =>
//{
//    opts.Lockout.AllowedForNewUsers
//})

// Register Swagger services and configure SwaggerDoc for Admin and User
builder.Services.AddSwaggerGen(options =>
{
    // Define Swagger docs for each area (Admin, Customer, etc.)
    options.SwaggerDoc("admin", new OpenApiInfo { Title = "Admin API", Version = "v1" });
    options.SwaggerDoc("client", new OpenApiInfo { Title = "Client API", Version = "v1" });

    // Include routes by area in their corresponding Swagger groups
    options.DocInclusionPredicate((docName, apiDesc) =>
    {
        var actionDescriptor = apiDesc.ActionDescriptor;

        // Check if the route has the "area" value (from the route)
        var area = actionDescriptor.RouteValues.ContainsKey("area")
            ? actionDescriptor.RouteValues["area"]
            : "default";  // Default area if none is provided

        // Only include API actions in the appropriate Swagger document for the area
        return docName.ToLower() == area.ToLower();
    });

    // Optionally, you can set up custom operation filters for controller-level tagging
    options.OperationFilter<CustomTagsOperationFilter>();

    // Add options to authenticate in Swagger UI 
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Use custom middleware
SQLHandlerAsync.Connectionconfig = connectionString;

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        // Display Swagger endpoints for different areas
        c.SwaggerEndpoint("/swagger/admin/swagger.json", "Admin API v1");
        c.SwaggerEndpoint("/swagger/client/swagger.json", "Client API v1");

        // Set Swagger UI route to the root
        c.RoutePrefix = string.Empty;  // Swagger UI at the root (http://localhost:5000/)
    });
}

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
