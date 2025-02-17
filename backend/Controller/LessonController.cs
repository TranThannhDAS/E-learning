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
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;
        public int chunkSize;
        private IConfiguration configuration;
        public LessonController(IWebHostEnvironment env, IConfiguration configuration, ILessonService lessonService, IMapper mapper)
        {
            _lessonService = lessonService;
            _mapper = mapper;
            _env = env;
            chunkSize = 1048576 * Convert.ToInt32(configuration["ChunkSize"]);
            this.configuration = configuration;
        }
        [HttpPost("Chukedfile")]
        public async Task<IActionResult> UploadChukedFile(string id, string fileName)
        {
            var chunkNumber = id;
            var path = Path.Combine(_env.WebRootPath, "Temp", fileName + chunkNumber);
            using (FileStream fs = System.IO.File.Create(path))
            {
                byte[] bytes = new byte[chunkSize];
                int bytesRead = 0;
                while ((bytesRead = await Request.Body.ReadAsync(bytes, 0, bytes.Length)) > 0)
                {
                    fs.Write(bytes, 0, bytesRead);
                }
            }
            return Ok(new
            {
                Success = true
            });
        }
        // POST: api/Lessons
        [HttpPost]
        public async Task<ActionResult<LessonDto>> CreateLesson([FromBody] LessonDtoCreate lessonDto)
        {
            try
            {
                if (lessonDto == null)
                {
                    return BadRequest(new { message = "Lesson data is required" });
                }

                //var lesson = _mapper.Map<Lesson>(lessonDto);
                var createdLesson = await _lessonService.CreateAsync(lessonDto);
                //var createdLessonDto = _mapper.Map<LessonDto>(createdLesson);
                return CreatedAtAction(nameof(GetLesson), new { id = createdLesson.Id }, createdLesson);
            }catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/Lessons
        /*        [HttpGet("pagination")]
                public async Task<ActionResult<IEnumerable<LessonDto>>> GetAllLessons([FromQuery] Pagination pagination)
                {
                    var lessons = await _lessonService.GetAllAsync(pagination);
                    var lessonDtos = _mapper.Map<List<LessonDto>>(lessons.Item1);
                    return Ok(new { TotalCount = lessons.Item2, Lessons = lessonDtos });
                }*/

        [HttpGet("GetAllLessonsByChapterID")]
        public async Task<ActionResult<object>> GetAllLessonsByChapterID(int chapterID)
        {
            var lessons = await _lessonService.GetAllAsync(chapterID);
            //var lessonDtos = _mapper.Map<List<LessonDto>>(lessons);
            return Ok(new { ChapterID = chapterID, Lessons = lessons });
        }

        // GET: api/Lessons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LessonDto>> GetLesson(int id)
        {
            var lesson = await _lessonService.GetByIdAsync(id);
            if (lesson.Item1 == null)
            {
                return NotFound(new { message = $"Lesson with ID {id} not found." });
            }
            //var lessonDto = _mapper.Map<LessonDto>(lesson);
            return Ok(new { Index = lesson.Item2, Lesson = lesson.Item1 });
        }

        // update
        [HttpPut("UpdateLesson")]
        public async Task<IActionResult> UpdateLesson([FromBody] LessonDtoUpdate lessonDto)
        {
            if (lessonDto == null)
            {
                return BadRequest(new { message = "Invalid lesson data" });
            }
            //var data = _mapper.Map<Lesson>(lessonDto);
            var updatedLesson = await _lessonService.UpdateAsync(lessonDto.Id, lessonDto);
            if (updatedLesson == null)
            {
                return NotFound(new { message = $"Lesson with ID {lessonDto.Id} not found." });
            }
            return Ok(updatedLesson);
        }

        // DELETE: api/Lessons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            var success = await _lessonService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Lesson with ID {id} not found." });
            }
            return Ok(new { message = "Delete successfuly!!!" });
        }

        //update view 
        [HttpPut("updateview/{lessonId}")]
        public async Task<IActionResult> UpdateView (int lessonId )
        {
            try
            {
                var lesson = await _lessonService.UpdateView(lessonId);
                return CreatedAtAction(nameof(GetLesson), new { id = lessonId }, lesson);
            }catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }
    }
}
