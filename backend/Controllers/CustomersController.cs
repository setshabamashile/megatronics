using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Megatronics.Api.Data;

namespace Megatronics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly MegatronicsDbContext _context;

    public CustomersController(MegatronicsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCustomers()
    {
        var customers = await _context.Customers
            .Select(c => new
            {
                c.Id,
                c.FirstName,
                c.LastName,
                c.Email,
                c.Phone,
                c.CreatedAt,
                OrderCount = c.Orders.Count()
            })
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return Ok(customers);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCustomer(int id)
    {
        var customer = await _context.Customers
            .Include(c => c.Orders)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
        {
            return NotFound(new
            {
                message = "Customer not found."
            });
        }

        return Ok(customer);
    }
}