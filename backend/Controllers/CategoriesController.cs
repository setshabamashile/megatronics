using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Megatronics.Api.Data;
using Megatronics.Api.Models;

namespace Megatronics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly MegatronicsDbContext _context;

    public CategoriesController(MegatronicsDbContext context)
    {
        _context = context;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(categories);
    }

    // GET: api/categories/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return NotFound(new
            {
                message = "Category not found."
            });
        }

        return Ok(category);
    }

    // POST: api/categories
    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(
        Category category)
    {
        category.Id = 0;

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetCategory),
            new { id = category.Id },
            category
        );
    }

    // PUT: api/categories/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategory(
        int id,
        Category category)
    {
        if (id != category.Id)
        {
            return BadRequest(new
            {
                message = "Category ID mismatch."
            });
        }

        var existingCategory =
            await _context.Categories.FindAsync(id);

        if (existingCategory == null)
        {
            return NotFound(new
            {
                message = "Category not found."
            });
        }

        existingCategory.Name = category.Name;
        existingCategory.Slug = category.Slug;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/categories/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category =
            await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound(new
            {
                message = "Category not found."
            });
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}