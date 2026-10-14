using Microsoft.EntityFrameworkCore;
using Megatronics.Api.Data;
using Megatronics.Api.Configuration;
using Megatronics.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<PayFastSettings>(
    builder.Configuration.GetSection("PayFast")
);

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddScoped<PayFastService>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("DefaultConnection is not configured.");

builder.Services.AddDbContext<MegatronicsDbContext>(options =>
    options.UseSqlServer(connectionString)
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();

app.UseCors("Frontend");

app.MapControllers();

app.Run();