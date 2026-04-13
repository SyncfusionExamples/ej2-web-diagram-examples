using Diagram_MySQL.Server.Data;
using Diagram_MySQL.Server.Models;
using LinqToDB.Async;
using Microsoft.AspNetCore.Mvc;

namespace Diagram_MySQL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiagramController : ControllerBase
    {
        private readonly AppDataConnection _db;
        public DiagramController(AppDataConnection db) => _db = db;

        // GET: /api/diagram/items
        // Returns an array of items with Id, ParentId, Name suitable for Diagram dataSource.
        [HttpGet("items")]
        public async Task<IActionResult> GetItems()
        {
            var items = await _db.Employees
                .Select(e => new { e.Id, e.ParentId, e.Name })
                .ToListAsync();

            return Ok(items);
        }
    }
}