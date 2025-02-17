using AutoMapper;
using backend.Attributes;
using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nest;
using System.Net.WebSockets;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    //[JwtAuthorize("user","admin")]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerService _answerService;
        private readonly IMapper _mapper;


        public AnswerController(IWebHostEnvironment env, IConfiguration _configuration, IAnswerService answerService, IMapper mapper)
        {
            _answerService = answerService;
            _mapper = mapper;
        }
        [HttpPost("AddsomeData")]
        public async Task<IActionResult> AddData([FromQuery] string id, string fileName)
        {
            return Ok();
        }
        [HttpGet("check")]
        public async Task<IActionResult> CheckConnection()
        {
            var pingResponse = 1;

            return Ok("Connect OK");


        }

        // POST: api/Answers
        [HttpPost]
        public async Task<ActionResult<AnswerDto>> CreateAnswer([FromBody] AnswerDto answerDto)
        {
            if (answerDto == null)
            {
                return BadRequest(new { message = "Answer data is required" });
            }
            try
            {
                var answer = _mapper.Map<Answer>(answerDto);
                var createdAnswer = await _answerService.CreateAsync(answer);
                var createdAnswerDto = _mapper.Map<AnswerDto>(createdAnswer);
                return CreatedAtAction(nameof(GetAnswer), new { id = createdAnswerDto.Id }, createdAnswerDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        // GET: api/Answers
        [HttpGet("pagination")]
        public async Task<ActionResult<IEnumerable<AnswerDto>>> GetAllAnswers([FromQuery] Pagination pagination)
        {
            try
            {
                var (answers, totalCount) = await _answerService.GetAllAsync(pagination);
                var answerDtos = _mapper.Map<List<AnswerDto>>(answers);
                return Ok(new { TotalCount = totalCount, Items = answerDtos });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet()]
        public async Task<IActionResult> GetAllAnswers()
        {
            try
            {
                var answers = await _answerService.GetAllAsync();
                //var answerDtos = _mapper.Map<List<AnswerDto>>(answers);
                return Ok(answers);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/Answers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AnswerDto>> GetAnswer(int id)
        {
            var answer = await _answerService.GetByIdAsync(id);
            if (answer.Item1 == null)
            {
                return NotFound(new { message = $"Answer with ID {id} not found." });
            }
            var answerDto = _mapper.Map<AnswerDto>(answer.Item1);
            return Ok(new { Answer = answerDto, Exam = answer.Item2 });
        }

        // PUT: api/Answers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnswer(int id, [FromBody] AnswerDto answerDto)
        {
            if (answerDto == null)
            {
                return BadRequest(new { message = "Invalid answer data" });
            }

            var answer = _mapper.Map<Answer>(answerDto);
            var updatedAnswer = await _answerService.UpdateAsync(id, answer);
            if (updatedAnswer == null)
            {
                return NotFound(new { message = $"Answer with ID {id} n ot found." });
            }
            return Ok(_mapper.Map<AnswerDto>(updatedAnswer));
        }

        // DELETE: api/Answers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnswer(int id)
        {
            var success = await _answerService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Answer with ID {id} not found." });
            }
            return NoContent(); // Using NoContent for successful delete as it's more appropriate than Ok in REST terms.
        }
        [HttpGet("GetAllByUserIdAndExamId")]
        public async Task<IActionResult> GetAllByUserIdAndExamId(int userId, int examId)
        {
            var result = await _answerService.GetAllByUserIdAndExamId(userId, examId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
    }
}
