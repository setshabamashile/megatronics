using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Megatronics.Api.Data;

namespace Megatronics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly MegatronicsDbContext _context;

    public DashboardController(MegatronicsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var productCount = await _context.Products.CountAsync();

        var categoryCount = await _context.Categories.CountAsync();

        return Ok(new
        {
            products = productCount,
            categories = categoryCount,
            orders = 0,
            sales = 0
        });
    }
}