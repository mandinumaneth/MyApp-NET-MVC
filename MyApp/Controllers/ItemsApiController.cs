using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.Data;
using MyApp.Models;

namespace MyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsApiController : ControllerBase
    {
        private readonly MyAppContext _context;

        public ItemsApiController(MyAppContext context)
        {
            _context = context;
        }

        // GET: api/ItemsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            var items = await _context.Items
                .Include(s => s.SerialNumber)
                .Include(c => c.Category)
                .Include(ic => ic.ItemClients!)
                .ThenInclude((ItemClient ic) => ic.Client)
                .ToListAsync();
            return Ok(items);
        }

        // GET: api/ItemsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items
                .Include(s => s.SerialNumber)
                .Include(c => c.Category)
                .Include(ic => ic.ItemClients!)
                .ThenInclude((ItemClient ic) => ic.Client)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        // POST: api/ItemsApi
        [HttpPost]
        public async Task<ActionResult<Item>> CreateItem([FromBody] ItemCreateDto itemDto)
        {
            var item = new Item
            {
                Name = itemDto.Name,
                Price = itemDto.Price,
                CategoryId = itemDto.CategoryId
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            // Add ItemClient relationship
            if (itemDto.ClientId > 0)
            {
                var itemClient = new ItemClient { ItemId = item.Id, ClientId = itemDto.ClientId };
                _context.Add(itemClient);
            }

            // Auto-generate serial number as CategoryName+ItemId
            var category = await _context.Categories.FindAsync(item.CategoryId);
            string categoryName = category?.Name ?? "SN";
            string serialNumberToUse = $"{categoryName}{item.Id:D3}";
            var serialToAdd = new SerialNumber { Name = serialNumberToUse, ItemId = item.Id };
            _context.SerialNumbers.Add(serialToAdd);
            await _context.SaveChangesAsync();

            // Set SerialNumberId on item
            item.SerialNumberId = serialToAdd.Id;
            _context.Items.Update(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
        }

        // PUT: api/ItemsApi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemCreateDto itemDto)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            item.Name = itemDto.Name;
            item.Price = itemDto.Price;
            item.CategoryId = itemDto.CategoryId;

            _context.Update(item);

            // Remove old ItemClient and add new one
            var existing = await _context.ItemClients.FirstOrDefaultAsync(ic => ic.ItemId == item.Id);
            if (existing != null)
            {
                _context.ItemClients.Remove(existing);
            }

            if (itemDto.ClientId > 0)
            {
                _context.ItemClients.Add(new ItemClient { ItemId = item.Id, ClientId = itemDto.ClientId });
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ItemsApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            // Remove related ItemClients first (many-to-many relationship)
            var itemClients = await _context.ItemClients.Where(ic => ic.ItemId == item.Id).ToListAsync();
            if (itemClients.Any())
            {
                _context.ItemClients.RemoveRange(itemClients);
            }

            // Remove related SerialNumber (one-to-one relationship)
            var serial = await _context.SerialNumbers.FirstOrDefaultAsync(s => s.ItemId == item.Id);
            if (serial != null)
            {
                _context.SerialNumbers.Remove(serial);
            }

            // Save changes for related entities first
            await _context.SaveChangesAsync();

            // Now remove the item
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class ItemCreateDto
    {
        public string Name { get; set; } = null!;
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public int ClientId { get; set; }
    }
}
