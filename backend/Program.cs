using backend.Controller;
using backend.Data;
using backend.Extentions;
using backend.Helper;
using backend.Middleware;
using backend.Service.Interface;
using backend.Worker;
using Elasticsearch.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nest;
using StackExchange.Redis;
using System.Net.Mail;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
var configuration = builder.Configuration;

var elasticsearchUri = new Uri(configuration["ElasticSearch:uri"]);
var username = configuration["ElasticSearch:username"];
var password = configuration["ElasticSearch:pass"];

if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password) || elasticsearchUri == null)
{
    throw new InvalidOperationException("Nhập thông tin ElasticSearch.");
}

// Thiết lập ConnectionSettings với Basic Authentication
var pool = new ConnectionSettings(elasticsearchUri)
    .BasicAuthentication(username, password);

var client = new ElasticClient(pool);

// Đăng ký client vào DI container
builder.Services.AddSingleton<IElasticClient>(client);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<LMSContext>(
    (options) =>
    {
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")
        );
    }
);
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var redisConfig = builder.Configuration.GetSection("Redis");
    var configurationOptions = new ConfigurationOptions
    {
        EndPoints = { redisConfig["Configuration"] },
        Password = redisConfig["Password"],
        AbortOnConnectFail = false
    };
    return ConnectionMultiplexer.Connect(configurationOptions);
});
builder.Services.AddAppServices();

// Jwt Config
builder.Services
    .AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(o =>
    {
        var Key = Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]);
        o.SaveToken = true;
        o.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Key),
            ClockSkew = TimeSpan.Zero
        };
        o.Events = new JwtBearerEvents()
        {
            OnAuthenticationFailed = (context) =>
            {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                {
                    context.Response.Headers.Append("IS-TOKEN-EXPIRED", "true");
                }
                return Task.CompletedTask;
            },
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // Nếu request là tới SignalR hub
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/examHub"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Thêm thông tin xác thực
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter 'Bearer {token}'",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    var securityRequirement = new OpenApiSecurityRequirement
    {
        { securityScheme, new[] { "Bearer" } }
    };
    c.AddSecurityRequirement(securityRequirement);
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<SmtpClient>(provider =>
{
    // Truy cập Configuration để lấy các thông tin cấu hình của SmtpClient từ appsettings hoặc các nguồn khác
    var configuration = provider.GetRequiredService<IConfiguration>();
    var smtpClient = new SmtpClient();
    //smtpClient.Host = configuration["SmtpConfig:HostName"];
    smtpClient.Port = int.Parse(configuration["SmtpConfig:Port"]);
    //smtpClient.EnableSsl = bool.Parse(configuration["SmtpConfig:EnableSsl"]);
    smtpClient.Credentials = new System.Net.NetworkCredential(
        configuration["SmtpConfig:Username"],
        configuration["SmtpConfig:Password"]
    );
    return smtpClient;
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed((host) => true)
        .AllowCredentials()
        .WithOrigins("http://localhost:5187", "https://localhost:7240"));
});
builder.Services.AddSignalR();

builder.Services.AddHostedService<CleanupUserConnectionService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseStaticFiles();
app.UseRouting();
app.UseCors("CorsPolicy");

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ExamHub>("/examHub");
});
app.UseHttpsRedirection();



app.UseMiddleware<GlobalErrorHandlingMiddleware>();
app.MapControllers();

app.Run();

