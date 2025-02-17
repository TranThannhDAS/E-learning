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
    //[JwtAuthorize("user", "admin")]
    public class ChapterController : ControllerBase
    {
        private readonly IChapterService _chapterService;
        private readonly IMapper _mapper;

        public ChapterController(IChapterService chapterService, IMapper mapper)
        {
            _chapterService = chapterService;
            _mapper = mapper;
        }
        [HttpGet("GetChapterBySourceID")]
        public async Task<IActionResult> GetChapterBySourceID(int sourceID)
        {
            var chapter = await _chapterService.GetChapterBySourceID(sourceID);
            if (chapter == null)
            {
                return NotFound();
            }
            return Ok(chapter);
        }
        // POST: api/Chapters
        [HttpPost]
        public async Task<ActionResult<ChapterDto>> CreateChapter([FromBody] ChapterDtoUpdate chapterDto)
        {
            if (chapterDto == null)
            {
                return NotFound(new { message = "Chapter data is required" });
            }

            var createdChapter = await _chapterService.CreateAsync(chapterDto);
            return Ok(createdChapter);
        }

        // GET: api/Chapters
        /*      [HttpGet("pagination")]
              public async Task<ActionResult<List<ChapterDto>>> GetAllChapters([FromQuery] Pagination pagination)
              {
                  var (chapters, totalCount) = await _chapterService.GetAllAsync(pagination);
                  var chapterDtos = _mapper.Map<List<ChapterDto>>(chapters);
                  return Ok(new { TotalCount = totalCount, Items = chapterDtos });
              }*/

        [HttpGet()]
        public async Task<ActionResult<List<ChapterDto>>> GetAllChapters()
        {
            var chapters = await _chapterService.GetAllAsync();
            var chapterDtos = _mapper.Map<List<ChapterDto>>(chapters);
            return Ok(chapterDtos);
        }
        // GET: api/Chapters/5
        /*   [HttpGet("{id}")]
           public async Task<ActionResult<ChapterDto>> GetChapter(int id)
           {
               var chapter = await _chapterService.GetByIdAsync(id);
               if (chapter == null)
               {
                   return NotFound(new { message = $"Chapter with ID {id} not found." });
               }
               var chapterDto = _mapper.Map<ChapterDto>(chapter);
               return Ok(chapterDto);
           }*/

        // PUT: api/Chapters/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChapter(int id, [FromBody] ChapterDtoUpdate chapterDto)
        {
            if (chapterDto == null)
            {
                return NotFound(new { message = "Invalid chapter data" });
            }
            var updatedChapter = await _chapterService.UpdateAsync(id, chapterDto);
            if (updatedChapter == null)
            {
                return NotFound(new { message = $"Chapter with ID {id} not found." });
            }
            return Ok(updatedChapter);
        }

        // DELETE: api/Chapters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChapter(int id)
        {
            var success = await _chapterService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Chapter with ID {id} not found." });
            }
            return NoContent();

        }
    }
}
