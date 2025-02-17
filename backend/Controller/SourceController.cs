using AutoMapper;
using backend.Attributes;
using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service;
using backend.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    //[JwtAuthorize("user", "admin")]
    public class SourceController : ControllerBase
    {
        private readonly ISourceService _sourceService;
        private readonly IMapper _mapper;
        private readonly IElasticSearchRepository _elasticsearchRepository;


        public SourceController(ISourceService sourceService, IMapper mapper, IElasticSearchRepository elasticSearchRepository)
        {

            _sourceService = sourceService;
            _mapper = mapper;
            _elasticsearchRepository = elasticSearchRepository;
        }

        // POST: api/Sources
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateSource([FromForm] SourceDto sourceDto)
        {
            try
            {

                if (sourceDto == null)
                {
                    return BadRequest(new { message = "Source data is required" });
                }

                var createdSource = await _sourceService.CreateAsync(sourceDto);
                var createdSourceDto = _mapper.Map<SourceViewDto>(createdSource);
                return CreatedAtAction(nameof(GetSource), new { id = createdSource.Id }, createdSourceDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Sources
        [HttpGet("pagination")]
        public async Task<ActionResult<IEnumerable<SourceWithTopicId>>> GetAllSources([FromQuery] Pagination pagination)
        {
            try
            {
                var (sources, totalCount) = await _sourceService.GetAllAsync(pagination);

                // Ánh xạ từ danh sách sources sang danh sách SourceDto
                //var sourceDtos = _mapper.Map<List<SourceViewDto>>(sources);

                // Gửi lại response bao gồm cả danh sách SourceDto và tổng số lượng (nếu cần)
                return Ok(new { TotalCount = totalCount, Items = sources });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SourceWithTopicId>>> GetAllSources()
        {
            try
            {
                var sources = await _sourceService.GetAllAsync();

                // Ánh xạ từ danh sách sources sang danh sách SourceDto
                //var sourceDtos = _mapper.Map<List<SourceViewDto>>(sources);

                // Gửi lại response bao gồm cả danh sách SourceDto và tổng số lượng (nếu cần)
                return Ok(sources);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Sources/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SourceViewDto>> GetSource(int id)
        {
            try
            {
                var source = await _sourceService.GetByIdAsync(id);
                if (source == null)
                {
                    return NotFound(new { message = $"Source with ID {id} not found." });
                }
                //var sourceDto = _mapper.Map<SourceViewDto>(source);
                return Ok(source);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("groupbytopic")]
        public async Task<IActionResult> GroupByTopic()
        {
            var result = await _sourceService.GroupByTopic();
            return Ok(result);
        }

        // PUT: api/Sources/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSource(int id, [FromForm] SourceDto sourceDto)
        {
            if (sourceDto == null)
            {
                return BadRequest(new { message = "Invalid Source data" });
            }
            //var source = _mapper.Map<Source>(sourceDto);
            var updatedSource = await _sourceService.UpdateAsync(id, sourceDto);
            if (updatedSource == null)
            {
                return NotFound(new { message = $"Source with ID {id} not found." });
            }
            return Ok(_mapper.Map<SourceViewDto>(updatedSource));
        }

        // DELETE: api/Sources/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSource(int id)
        {
            try
            {
                var success = await _sourceService.DeleteAsync(id);
                if (!success)
                {
                    return NotFound(new { message = $"Source with ID {id} not found." });
                }
                return NoContent(); // Using NoContent for successful delete as it's more appropriate than Ok in REST terms.
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("CheckOrderSource")]
        public async Task<IActionResult> CheckOrderSource([FromQuery] int userId, [FromQuery] int sourceId)
        {
            bool result = await _sourceService.SourceCheckOrder(userId, sourceId);
            return Ok(result);
        }
    }
}
