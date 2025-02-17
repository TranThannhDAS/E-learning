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
    [JwtAuthorize("user", "admin")]
    public class QuizQuestionController : ControllerBase
    {
        private readonly IQuizQuestionService _quizQuestionService;
        private readonly IMapper _mapper;

        public QuizQuestionController(IQuizQuestionService quizQuestionService, IMapper mapper)
        {
            _quizQuestionService = quizQuestionService;
            _mapper = mapper;
        }

        // POST: api/QuizQuestions
        [HttpPost]
        public async Task<ActionResult<QuizQuestionDto>> CreateQuizQuestion([FromBody] QuizQuestionDto quizQuestionDto)
        {
            if (quizQuestionDto == null)
            {
                return BadRequest(new { message = "Quiz question data is required" });
            }

            var quizQuestion = _mapper.Map<QuizQuestion>(quizQuestionDto);
            var createdQuizQuestion = await _quizQuestionService.CreateAsync(quizQuestion);
            var createdQuizQuestionDto = _mapper.Map<QuizQuestionDto>(createdQuizQuestion);
            return CreatedAtAction(nameof(GetQuizQuestion), new { id = createdQuizQuestionDto.Id }, createdQuizQuestionDto);
        }

        // GET: api/QuizQuestions
        [HttpGet("pagination")]
        public async Task<ActionResult<IEnumerable<QuizQuestionDto>>> GetAllQuizQuestions([FromQuery] Pagination pagination)
        {
            var quizQuestions = await _quizQuestionService.GetAllAsync(pagination);
            var quizQuestionDtos = _mapper.Map<List<QuizQuestionDto>>(quizQuestions.Item1);
            return Ok(new { TotalCount = quizQuestions.Item2, Items = quizQuestionDtos });
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizQuestionDto>>> GetAllQuizQuestions()
        {
            var quizQuestions = await _quizQuestionService.GetAllAsync();
            var quizQuestionDtos = _mapper.Map<List<QuizQuestionDto>>(quizQuestions);
            return Ok( quizQuestionDtos );
        }

        // GET: api/QuizQuestions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuizQuestionDto>> GetQuizQuestion(int id)
        {
            var quizQuestion = await _quizQuestionService.GetByIdAsync(id);
            if (quizQuestion == null)
            {
                return NotFound(new { message = $"Quiz question with ID {id} not found." });
            }
            var quizQuestionDto = _mapper.Map<QuizQuestionDto>(quizQuestion);
            return Ok(quizQuestionDto);
        }

        // PUT: api/QuizQuestions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuizQuestion(int id, [FromBody] QuizQuestionDto quizQuestionDto)
        {
            if (quizQuestionDto == null)
            {
                return BadRequest(new { message = "Invalid quiz question data" });
            }

            var quizQuestion = _mapper.Map<QuizQuestion>(quizQuestionDto);
            var updatedQuizQuestion = await _quizQuestionService.UpdateAsync(id, quizQuestion);
            if (updatedQuizQuestion == null)
            {
                return NotFound(new { message = $"Quiz question with ID {id} not found." });
            }
            return Ok(_mapper.Map<QuizQuestionDto>(updatedQuizQuestion));
        }

        // DELETE: api/QuizQuestions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuizQuestion(int id)
        {
            var success = await _quizQuestionService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Quiz question with ID {id} not found." });
            }
            return NoContent(); // Using NoContent for successful delete as it's more appropriate than Ok in REST terms.
        }
    }
}
