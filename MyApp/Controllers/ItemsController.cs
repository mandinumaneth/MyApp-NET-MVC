using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MyApp.Data;
using MyApp.Models;

namespace MyApp.Controllers
{
    public class ItemsController : Controller
    {
        private readonly MyAppContext _context;
        public ItemsController(MyAppContext context)
        {
            _context = context;
        }


        public async Task<IActionResult> Index()
        {
            var item = await _context.Items.Include(s => s.SerialNumber)
                                          .Include(c => c.Category)
                                          .Include(ic => ic.ItemClients!)
                                          .ThenInclude((ItemClient ic) => ic.Client)
                                          .ToListAsync();
            return View(item);
        }

        public IActionResult Create()
        {
            ViewData["Categories"] = new SelectList(_context.Categories, "Id", "Name");
            ViewData["Clients"] = new SelectList(_context.Clients, "Id", "Name");
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create([Bind("Id, Name, Price, CategoryId, SerialNumberName")] Item item, int ClientId)
        {
            if (ModelState.IsValid)
            {
                _context.Items.Add(item);
                await _context.SaveChangesAsync();
                // Add ItemClient relationship
                var itemClient = new ItemClient { ItemId = item.Id, ClientId = ClientId };
                _context.Add(itemClient);
                // Always auto-generate serial number as CategoryName+ItemId
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
                return RedirectToAction("Index");
            }
            ViewData["Categories"] = new SelectList(_context.Categories, "Id", "Name", item.CategoryId);
            ViewData["Clients"] = new SelectList(_context.Clients, "Id", "Name", ClientId);
            return View(item);
        }

        public async Task<IActionResult> Edit(int id)
        {
            ViewData["Categories"] = new SelectList(_context.Categories, "Id", "Name");
            ViewData["Clients"] = new SelectList(_context.Clients, "Id", "Name");
            var item = await _context.Items.Include(i => i.ItemClients).Include(i => i.SerialNumber).FirstOrDefaultAsync(x => x.Id == id);
            if (item != null && item.ItemClients != null && item.ItemClients.Count > 0)
            {
                item.ClientId = item.ItemClients[0].ClientId;
            }
            return View(item);
        }
        [HttpPost]
        public async Task<IActionResult> Edit(int id, [Bind("Id, Name, Price, CategoryId, ClientId, SerialNumberName")] Item item)
        {
            if (ModelState.IsValid)
            {
                _context.Update(item);
                // Remove old ItemClient and add new one
                var existing = await _context.ItemClients.FirstOrDefaultAsync(ic => ic.ItemId == item.Id);
                if (existing != null)
                {
                    _context.ItemClients.Remove(existing);
                    await _context.SaveChangesAsync();
                }
                _context.ItemClients.Add(new ItemClient { ItemId = item.Id, ClientId = item.ClientId });
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["Categories"] = new SelectList(_context.Categories, "Id", "Name", item.CategoryId);
            ViewData["Clients"] = new SelectList(_context.Clients, "Id", "Name", item.ClientId);
            return View(item);
        }
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.Items
                .Include(i => i.SerialNumber)
                .Include(i => i.Category)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            return View(item);
        }
        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item != null)
            {
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
            }
            return RedirectToAction("Index");
        }
    }
}
