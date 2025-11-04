using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.Data;
using MyApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace MyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriesApiController : ControllerBase
    {
        private readonly MyAppContext _context;

        public CategoriesApiController(MyAppContext context)
        {
            _context = context;
        }

        // GET: api/CategoriesApi
        [HttpGet]
        [Authorize(Policy = "read:items")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        // GET: api/CategoriesApi/5
        [HttpGet("{id}")]
        [Authorize(Policy = "read:items")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }
    }
}
