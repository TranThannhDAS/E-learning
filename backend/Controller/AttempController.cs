using AutoMapper;
using backend.Attributes;
using backend.Base;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    // [JwtAuthorize("user", "admin")]
    public class AttempController : ControllerBase
    {
        private readonly IAttempService _attempService;
        private readonly IMapper _mapper;

        public AttempController(IAttempService attempService, IMapper mapper)
        {
            _attempService = attempService;
            _mapper = mapper;
        }

        // POST: api/Attemps
        [HttpPost]
        public async Task<ActionResult<AttempDto>> CreateAttemp([FromBody] AttempDto attempDto)
        {
            if (attempDto == null)
            {
                return NotFound(new { message = "Attemp data is required" });
            }
            try
            {
                var attemp = _mapper.Map<Attemp>(attempDto);
                var createdAttemp = await _attempService.CreateAsync(attemp);
                var createdAttempDto = _mapper.Map<AttempDto>(createdAttemp);
                return CreatedAtAction(nameof(GetAttemp), new { id = createdAttempDto.Id }, createdAttempDto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        // GET: api/Attemps
        [HttpGet("pagination")]
        public async Task<ActionResult<IEnumerable<AttempDto>>> GetAllAttemps([FromQuery] Pagination pagination)
        {
            try
            {
                var (attemps, totalCount) = await _attempService.GetAllAsync(pagination);
                var attempDtos = _mapper.Map<List<AttempDto>>(attemps);
                return Ok(new { TotalCount = totalCount, Items = attempDtos });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttempDto>>> GetAllAttemps()
        {
            try
            {
                var attemps = await _attempService.GetAllAsync();
                var attempDtos = _mapper.Map<List<AttempDto>>(attemps);
                return Ok(attempDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        // GET: api/Attemps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AttempDto>> GetAttemp(int id)
        {
            try
            {
                var attemp = await _attempService.GetByIdAsync(id);
                var attempDto = _mapper.Map<AttempDto>(attemp);
                return Ok(attempDto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        // PUT: api/Attemps/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAttemp(int id, [FromBody] AttempDto attempDto)
        {
            if (attempDto == null)
            {
                return BadRequest(new { message = "Invalid attemp data" });
            }

            var attemp = _mapper.Map<Attemp>(attempDto);
            var updatedAttemp = await _attempService.UpdateAsync(id, attemp);
            if (updatedAttemp == null)
            {
                return NotFound(new { message = $"Attemp with ID {id} not found." });
            }
            return Ok(_mapper.Map<AttempDto>(updatedAttemp));
        }

        // DELETE: api/Attemps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttemp(int id)
        {
            var success = await _attempService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Attemp with ID {id} not found." });
            }
            return NoContent(); // Using NoContent for successful delete as it's more appropriate than Ok in REST terms.
        }
    }
}
