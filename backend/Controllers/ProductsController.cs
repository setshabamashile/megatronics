
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Megatronics.Api.Data;
using Megatronics.Api.Models;

namespace Megatronics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly MegatronicsDbContext _context;

    public ProductsController(MegatronicsDbContext context)
    {
        _context = context;
    }

    // GET: api/Products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetProducts()
    {
        var products = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(products.Select(ToResponse));
    }

    // GET: api/Products/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponse>> GetProduct(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = "Product not found." });
        }

        return Ok(ToResponse(product));
    }

    // POST: api/Products
    [HttpPost]
    public async Task<ActionResult<ProductResponse>> CreateProduct(
        [FromBody] ProductRequest request)
    {
        var validationError = await ValidateProduct(request);

        if (validationError != null)
        {
            return BadRequest(new { message = validationError });
        }

        var product = new Product
        {
            Name = request.Name.Trim(),
            Slug = request.Slug.Trim(),
            Description = request.Description?.Trim() ?? string.Empty,
            Specifications = request.Specifications?.Trim() ?? string.Empty,
            Price = request.Price,
            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl)
                ? null
                : request.ImageUrl.Trim(),
            Stock = request.Stock,
            Featured = request.Featured,
            CategoryId = request.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        await _context.Entry(product)
            .Reference(p => p.Category)
            .LoadAsync();

        var response = ToResponse(product);

        return CreatedAtAction(
            nameof(GetProduct),
            new { id = product.Id },
            response
        );
    }

    // PUT: api/Products/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(
        int id,
        [FromBody] ProductRequest request)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = "Product not found." });
        }

        var validationError = await ValidateProduct(request, id);

        if (validationError != null)
        {
            return BadRequest(new { message = validationError });
        }

        product.Name = request.Name.Trim();
        product.Slug = request.Slug.Trim();
        product.Description = request.Description?.Trim() ?? string.Empty;
        product.Specifications = request.Specifications?.Trim() ?? string.Empty;
        product.Price = request.Price;
        product.ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl)
            ? null
            : request.ImageUrl.Trim();
        product.Stock = request.Stock;
        product.Featured = request.Featured;
        product.CategoryId = request.CategoryId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Products/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = "Product not found." });
        }

        var usedInOrders = await _context.OrderItems
            .AnyAsync(item => item.ProductId == id);

        if (usedInOrders)
        {
            return Conflict(new
            {
                message = "This product is linked to existing orders and cannot be deleted."
            });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<string?> ValidateProduct(
        ProductRequest request,
        int? existingProductId = null)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return "Product name is required.";
        }

        if (string.IsNullOrWhiteSpace(request.Slug))
        {
            return "Product slug is required.";
        }

        if (request.Price < 0)
        {
            return "Product price cannot be negative.";
        }

        if (request.Stock < 0)
        {
            return "Product stock cannot be negative.";
        }

        var slug = request.Slug.Trim();

        var slugExists = await _context.Products.AnyAsync(p =>
            p.Slug == slug &&
            (!existingProductId.HasValue || p.Id != existingProductId.Value));

        if (slugExists)
        {
            return "A product with this slug already exists.";
        }

        if (request.CategoryId.HasValue)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == request.CategoryId.Value);

            if (!categoryExists)
            {
                return "The selected category does not exist.";
            }
        }

        return null;
    }

    private static ProductResponse ToResponse(Product product)
    {
        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            Specifications = product.Specifications,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            Stock = product.Stock,
            Featured = product.Featured,
            CategoryId = product.CategoryId,
            CreatedAt = product.CreatedAt,
            Category = product.Category == null
                ? null
                : new CategoryResponse
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name,
                    Slug = product.Category.Slug
                }
        };
    }
}

public class ProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Specifications { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int Stock { get; set; }
    public bool Featured { get; set; }
    public int? CategoryId { get; set; }
}

public class ProductResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Specifications { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int Stock { get; set; }
    public bool Featured { get; set; }
    public int? CategoryId { get; set; }
    public DateTime CreatedAt { get; set; }
    public CategoryResponse? Category { get; set; }
}

public class CategoryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}
