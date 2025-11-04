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
    public class ClientsApiController : ControllerBase
    {
        private readonly MyAppContext _context;

        public ClientsApiController(MyAppContext context)
        {
            _context = context;
        }

        // GET: api/ClientsApi
        [HttpGet]
        [Authorize(Policy = "read:clients")]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            return await _context.Clients.ToListAsync();
        }

        // GET: api/ClientsApi/5
        [HttpGet("{id}")]
        [Authorize(Policy = "read:clients")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);

            if (client == null)
            {
                return NotFound();
            }

            return client;
        }

        // POST: api/ClientsApi
        [HttpPost]
        [Authorize(Policy = "write:clients")]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
        }

        // DELETE: api/ClientsApi/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "delete:clients")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            // Remove associated ItemClient records first
            var itemClients = await _context.ItemClients.Where(ic => ic.ClientId == id).ToListAsync();
            _context.ItemClients.RemoveRange(itemClients);
            await _context.SaveChangesAsync();

            // Remove the client
            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
