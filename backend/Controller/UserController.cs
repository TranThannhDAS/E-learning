using AutoMapper;
using backend.Dtos.UserDto;
using backend.Entities;
using backend.Exceptions;
using backend.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        // GET: /user/get-all-user
        [HttpGet("get-all-user")]
        public async Task<IActionResult> GetAllUser()
        {
            try
            {
                var user = await _userService.GetListUsers();
                //var data = _mapper.Map<List<ListUserDto>>(user);
                return Ok(user);

            }
            catch (Exception ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
        }

        // GET: /user/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            try
            {
                var user = await _userService.GetById(userId);
                //var data = _mapper.Map<ListUserDto>(user);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
        }
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {

            var success = await _userService.DeleteUser(userId);
            if (!success)
            {
                return NotFound(new { message = $"Exam with ID {userId} not found." });
            }
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] UserLoginDto loginViewModel)
        {
            try
            {
                var result = await _userService.Login(loginViewModel);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
        }
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromForm] UserRegisterDto registerViewModel)
        {
            try
            {
                //var data = _mapper.Map<User>(registerViewModel);
                var newUser = await _userService.Create(registerViewModel);
                return Ok(newUser);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
        }
        [HttpPost("register-admin")]
        public async Task<ActionResult<User>> RegisterAdminAccount([FromForm] UserRegisterDto registerViewModel)
        {
            try
            {
                //var data = _mapper.Map<User>(registerViewModel);
                var newUser = await _userService.CreateAdminAccount(registerViewModel);
                return Ok(newUser);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
        }


        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateUsser([FromForm] UserUpdateDto registerViewModel,int userId)
        {
            try
            {
                var newUser = await _userService.UpdateUser(userId, registerViewModel);
                var userUpdate = _mapper.Map<UserUpdateDto>(newUser);
                return Ok(userUpdate);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
        }

        // POST: /user/forgot-password
        [HttpPost("forgot-password")]
        public async Task<ActionResult> SendForgotPasswordEmail([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var isUserExists = await _userService.GetByUsername(request.Username ?? "");


                if (isUserExists is null)
                {
                    return BadRequest(new { massage = "User is not existed" });
                }

                var confirmationCode = _userService.GenerateRandomCode();

                request.ExpirationTime = DateTime.UtcNow.AddMinutes(2);
                request.Code = confirmationCode;

                await _userService.AddRequest(request);
                _userService.SendConfirmationEmail(isUserExists.Email, confirmationCode);
                return Ok(new { massage = "Confirmation email sent." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
            //catch (NotFoundException ex)
            //{
            //    return NotFound(ex.Message);
            //}
        }
        // POST: /user/verify-reset-code
        [HttpPost("verify-reset-code")]
        public async Task<ActionResult> VerifyCodeResetPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var confirmCode = await _userService.GetByUserNameAndCode(request.Username ?? "", request.Code ?? "");

                if (confirmCode is null)
                {
                    return NotFound(new { message = "confirm code invalid" });
                }

                if (confirmCode.ExpirationTime < DateTime.UtcNow)
                {
                    await _userService.RemoveConfirmCode(confirmCode);
                    return NotFound(new { message = "The code has expired" });
                }
                await _userService.RemoveConfirmCode(confirmCode);
                return Ok(new { message = "Comfirm successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { massage = ex.Message });
            }
            catch (NotFoundException ex)
            {
                return BadRequest(new { massage = ex.Message });
            }

        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassworkDto user)
        {
            try
            {
                await _userService.ChangePassword(user);
                return Ok(new { message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                // Handle the exception as needed, perhaps logging it or customizing the error message
                return BadRequest(new { message = "Failed to change password.", details = ex.Message });
            }
        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto user)
        {
            try
            {
                await _userService.ResetPassword(user);
                return Ok(new { message = "Password has been reset successfully." });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle other exceptions that could occur
                return BadRequest(new { message = "Failed to reset password.", details = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] Tokens tokens)
        {
            try
            {
                var newTokens = await _userService.Refresh(tokens);
                if (newTokens == null)
                {
                    return BadRequest(new { message = "Could not refresh tokens." });
                }
                return Ok(newTokens);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] Tokens token)
        {
            try
            {
                await _userService.Logout(token);
                return Ok(new { message = "Logout successfully." });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle other exceptions that could occur
                return BadRequest(new { message = "Failed to logout.", details = ex.Message });
            }
        }
    }
}
