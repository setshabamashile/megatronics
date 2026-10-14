using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Megatronics.Api.Data;
using Megatronics.Api.Dtos;
using Megatronics.Api.Models;

namespace Megatronics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private const decimal DeliveryFee = 110m;

    private readonly MegatronicsDbContext _context;

    public OrdersController(MegatronicsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(
        CreateOrderRequest request)
    {
        if (request.Items == null || request.Items.Count == 0)
        {
            return BadRequest(new
            {
                message = "Your cart is empty."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Customer.FirstName) ||
            string.IsNullOrWhiteSpace(request.Customer.LastName) ||
            string.IsNullOrWhiteSpace(request.Customer.Email) ||
            string.IsNullOrWhiteSpace(request.Customer.Phone))
        {
            return BadRequest(new
            {
                message = "Customer information is incomplete."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Delivery.Address) ||
            string.IsNullOrWhiteSpace(request.Delivery.Suburb) ||
            string.IsNullOrWhiteSpace(request.Delivery.Province) ||
            string.IsNullOrWhiteSpace(request.Delivery.PostalCode))
        {
            return BadRequest(new
            {
                message = "Delivery information is incomplete."
            });
        }

        if (request.Items.Any(i => i.Quantity <= 0))
        {
            return BadRequest(new
            {
                message = "Product quantities must be greater than zero."
            });
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var productIds = request.Items
                .Select(i => i.ProductId)
                .Distinct()
                .ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            if (products.Count != productIds.Count)
            {
                return BadRequest(new
                {
                    message = "One or more products no longer exist."
                });
            }

            var order = new Order
            {
                OrderNumber = GenerateOrderNumber(),

                DeliveryName = request.Delivery.Name.Trim(),
                DeliveryPhone = request.Delivery.Phone.Trim(),
                DeliveryEmail = request.Delivery.Email.Trim(),
                Address = request.Delivery.Address.Trim(),
                Suburb = request.Delivery.Suburb.Trim(),
                Province = request.Delivery.Province.Trim(),
                PostalCode = request.Delivery.PostalCode.Trim(),

                DeliveryFee = DeliveryFee,

                PaymentStatus = PaymentStatus.Pending,
                Status = OrderStatus.Pending,

                CreatedAt = DateTime.UtcNow
            };

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c =>
                    c.Email == request.Customer.Email.Trim());

            if (customer == null)
            {
                customer = new Customer
                {
                    FirstName = request.Customer.FirstName.Trim(),
                    LastName = request.Customer.LastName.Trim(),
                    Email = request.Customer.Email.Trim(),
                    Phone = request.Customer.Phone.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }
            else
            {
                customer.FirstName =
                    request.Customer.FirstName.Trim();

                customer.LastName =
                    request.Customer.LastName.Trim();

                customer.Phone =
                    request.Customer.Phone.Trim();
            }

            order.CustomerId = customer.Id;

            decimal subtotal = 0;

            foreach (var requestedItem in request.Items)
            {
                var product = products.First(
                    p => p.Id == requestedItem.ProductId);

                if (product.Stock < requestedItem.Quantity)
                {
                    return BadRequest(new
                    {
                        message =
                            $"Insufficient stock for {product.Name}."
                    });
                }

                var lineTotal =
                    product.Price * requestedItem.Quantity;

                subtotal += lineTotal;

                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id,

                    ProductName = product.Name,

                    UnitPrice = product.Price,

                    Quantity = requestedItem.Quantity,

                    LineTotal = lineTotal
                });

                product.Stock -= requestedItem.Quantity;
            }

            order.Subtotal = subtotal;
            order.Total = subtotal + DeliveryFee;

            _context.Orders.Add(order);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return CreatedAtAction(
                nameof(GetOrder),
                new { id = order.Id },
                new
                {
                    order.Id,
                    order.OrderNumber,
                    order.Subtotal,
                    order.DeliveryFee,
                    order.Total,
                    order.PaymentStatus,
                    order.Status
                });
        }
        catch
        {
            await transaction.RollbackAsync();

            return StatusCode(500, new
            {
                message = "Unable to create the order."
            });
        }
    }

    private static string GenerateOrderNumber()
    {
        return $"MEGA-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}