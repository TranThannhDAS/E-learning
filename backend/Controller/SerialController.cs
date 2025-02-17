using backend.Entities;
using backend.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class SerialController : ControllerBase
    {
        private readonly ISerialService _serialService;

        public SerialController(ISerialService serialService)
        {
            _serialService = serialService;
        }

        // GET: api/Serials
        [HttpGet]
        public async Task<IActionResult> GetAllSerials()
        {
            var serials = await _serialService.GetAllAsync();
            return Ok(serials);
        }

        // DELETE: api/Serials/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSerial(int id)
        {
            var success = await _serialService.DeleteAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return Ok();
        }
    }
}
