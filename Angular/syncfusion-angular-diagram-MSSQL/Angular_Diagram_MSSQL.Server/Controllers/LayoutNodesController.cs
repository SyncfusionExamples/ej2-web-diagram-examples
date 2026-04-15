using Angular_Diagram_MSSQL.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Syncfusion.EJ2.Base;
using Newtonsoft.Json.Linq;

namespace Angular_Diagram_MSSQL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LayoutNodesController : ControllerBase
    {
        private readonly LayoutNodeRepository _repo;
        private readonly DataOperations _dataOps = new DataOperations();

        private readonly ILogger<LayoutNodesController> _logger;
        public LayoutNodesController(LayoutNodeRepository repo, ILogger<LayoutNodesController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            IEnumerable<LayoutNode> data = await _repo.GetLayoutNodesAsync();
            return Ok(data);
        }

        // READ (DataManager + UrlAdaptor expects POST)
        // POST api/layoutnodes
        [HttpPost]
        public async Task<IActionResult> List([FromBody] JObject? body)
        {
            IEnumerable<LayoutNode> data = await _repo.GetLayoutNodesAsync();


            if (body == null)
                return Ok(data);

            // Try to map JObject to DataManagerRequest, fallback to all data if fails
            DataManagerRequest? dm = null;
            try
            {
                dm = body.ToObject<DataManagerRequest>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to deserialize DataManagerRequest. Incoming payload: {Payload}", body.ToString());
                return BadRequest(new { error = "Failed to deserialize DataManagerRequest", details = ex.Message, payload = body.ToString() });
            }

            if (dm == null)
            {
                _logger.LogWarning("DataManagerRequest is null after deserialization. Incoming payload: {Payload}", body.ToString());
                return BadRequest(new { error = "DataManagerRequest is null after deserialization", payload = body.ToString() });
            }

            // Searching
            if (dm.Search != null && dm.Search.Count > 0)
            {
                data = _dataOps.PerformSearching(data, dm.Search);
            }

            // Filtering
            if (dm.Where != null && dm.Where.Count > 0)
            {
                try
                {
                    data = _dataOps.PerformFiltering(data, dm.Where, dm.Where[0].Operator);
                }
                catch
                {
                    // Ignore filter errors and return unfiltered data
                }
            }

            // Sorting
            if (dm.Sorted != null && dm.Sorted.Count > 0)
            {
                data = _dataOps.PerformSorting(data, dm.Sorted);
            }

            // Count BEFORE paging
            int count = data.Count();

            // Paging
            if (dm.Skip != 0)
                data = _dataOps.PerformSkip(data, dm.Skip);
            if (dm.Take != 0)
                data = _dataOps.PerformTake(data, dm.Take);

            // Final shape required by UrlAdaptor
            return Ok(dm.RequiresCounts ? new { result = data, count } : data);
        }

        [HttpGet("ping")]
        public IActionResult Ping() => Ok(new { ok = true, time = DateTime.UtcNow });
    }
}
