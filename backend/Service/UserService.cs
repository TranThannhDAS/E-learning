using backend.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using backend.Exceptions;
using backend.Service.Interface;
using backend.Dtos.UserDto;
using System.Security.Cryptography;
using AutoMapper;
using backend.Dtos;
using System.Text.Json;

namespace backend.Service
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _config;
        private readonly SmtpClient _smtpClient;
        private readonly LMSContext _context;
        private readonly IimageServices _imageServiecs;
        private readonly IMapper _mapper;
        private readonly IimageServices _imageServices;
        private readonly IRedisService _redisService;

        public UserService(IConfiguration configuration, SmtpClient smtpClient, LMSContext context, IimageServices imageServiecs, IMapper mapper, IimageServices imageServices, IRedisService redisService)
        {
            _config = configuration;
            _smtpClient = new SmtpClient
            {
                Host = _config["SmtpConfig:SmtpServer"],
                Port = int.Parse(_config["SmtpConfig:Port"]),
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(
                   _config["SmtpConfig:Username"],
                   _config["SmtpConfig:Password"]
               ),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network
            };
            _context = context;
            _imageServiecs = imageServiecs;
            _mapper = mapper;
            _imageServices = imageServices;
            _redisService = redisService;
        }

        public async Task<List<ListUserDto>> GetListUsers()
        {
            var users = await _context.Users
                .Select(u => new User
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Avatar = u.Avatar != null ? _imageServices.GetFile(u.Avatar) : null,
                    RoleId = u.RoleId
                })
                .ToListAsync();
            return _mapper.Map<List<ListUserDto>>(users) ?? throw new NotFoundException("there are no users at all");
        }
        public async Task<User?> Create(UserRegisterDto registerViewModel)
        {
            var existingUserByUsername = await GetByUsername(registerViewModel.Username ?? "");
            if (existingUserByUsername != null)
            {
                throw new BadRequestException("Username already exists");
            }

            var existingUserByEmail = await GetByEmail(registerViewModel.Email ?? "");
            if (existingUserByEmail != null)
            {
                throw new BadRequestException("Email already exists");
            }

            var role = await _context.Roles.SingleOrDefaultAsync(t => t.RoleName.ToLower().Equals("user"));
            if (registerViewModel.Avatar != null && !_imageServices.IsImage(registerViewModel.Avatar))
            {
                throw new Exception("Invalid image format. Only JPG, JPEG, PNG, and GIF are allowed.");
            }
            var newUser = new User
            {
                Username = registerViewModel.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerViewModel.Password),
                Email = registerViewModel.Email,
                PhoneNumber = registerViewModel.PhoneNumber,
                Avatar = registerViewModel.Avatar != null ? _imageServices.AddFile(registerViewModel.Avatar, "User", "Avartar") : null,
                RoleId = role.Id
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return newUser;
        }

        public async Task<User?> CreateAdminAccount(UserRegisterDto registerViewModel)
        {
            var existingUserByUsername = await GetByUsername(registerViewModel.Username ?? "");
            if (existingUserByUsername != null)
            {
                throw new BadRequestException("Username already exists");
            }

            var existingUserByEmail = await GetByEmail(registerViewModel.Email ?? "");
            if (existingUserByEmail != null)
            {
                throw new BadRequestException("Email already exists");
            }
            var role = await _context.Roles.SingleOrDefaultAsync(t => t.RoleName.ToLower().Equals("admin"));
            if (registerViewModel.Avatar != null && !_imageServices.IsImage(registerViewModel.Avatar))
            {
                throw new Exception("Invalid image format. Only JPG, JPEG, PNG, and GIF are allowed.");
            }
            var newUser = new User
            {
                Username = registerViewModel.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerViewModel.Password),
                Email = registerViewModel.Email,
                PhoneNumber = registerViewModel.PhoneNumber,
                Avatar = registerViewModel.Avatar != null ? _imageServices.AddFile(registerViewModel.Avatar, "User", "Avartar") : null,
                RoleId = role.Id
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return newUser;
        }

        public async Task<User> UpdateUser(int userId, UserUpdateDto registerViewModel)
        {
            var existingUser = await _context.Users.FindAsync(userId);
            if (existingUser == null)
            {
                throw new BadRequestException("Username not found");
            }
            existingUser.PhoneNumber = registerViewModel.PhoneNumber;
            existingUser.Email = registerViewModel.Email;
            existingUser.Avatar = registerViewModel.Avatar != null ? _imageServices.UpdateFile(registerViewModel.Avatar, existingUser.Avatar, "User", "Avartar") : null;
            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task<bool> DeleteUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            string filePath = user.Avatar;
            if (user == null) return false;
            var sources = await _context.Sources.Where(s => s.UserId == userId).ToListAsync();
            if (sources != null)
            {
                _context.Sources.RemoveRange(sources);
            }
            var answers = await _context.Answers.Where(a => a.UserId == userId).ToListAsync();
            if (answers != null)
            {
                _context.Answers.RemoveRange(answers);
            }
            var attemps = await _context.Attemps.Where(a => a.UserId == userId).ToListAsync();
            if (attemps != null)
            {
                _context.Attemps.RemoveRange(attemps);
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            if (filePath != null)
            {
                _imageServiecs.DeleteFile(filePath);
            }
            return true;
        }

        public async Task<User?> GetByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            //user.Avatar = user.Avatar != null ? _imageServices.GetFile(user.Avatar) : null;
            return user;
        }

        public async Task<ListUserDto?> GetById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
                user.Avatar = user.Avatar != null ? _imageServices.GetFile(user.Avatar) : null;
            return _mapper.Map<ListUserDto?>(user);
        }

        public async Task<ListUserDto?> GetByUsername(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.Equals(username));
            //user.Avatar = user.Avatar != null ? _imageServices.GetFile(user.Avatar) : null;
            return _mapper.Map<ListUserDto?>(user);
        }

        public async Task<Tuple<Tokens, User>> Login(UserLoginDto loginViewModel)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginViewModel.Username);

            if (user != null && BCrypt.Net.BCrypt.Verify(loginViewModel.Password, user.Password))
            {
                var roleName = await _context.Roles.Where(r => r.Id == user.RoleId).Select(r => r.RoleName).FirstOrDefaultAsync();
                // Nếu xác thực thành công, tạo JWT token
                //var tokenHandler = new JwtSecurityTokenHandler();
                //var key = Encoding.ASCII.GetBytes(_config["Jwt:SecretKey"] ?? "");
                //var tokenDescriptor = new SecurityTokenDescriptor
                //{
                //    Subject = new ClaimsIdentity(new Claim[]
                //    {
                //        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                //        new Claim(ClaimTypes.Role, user.RoleId.ToString()),
                //        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                //        new Claim(JwtRegisteredClaimNames.Aud, _config["JWT:Audience"]),
                //        new Claim(JwtRegisteredClaimNames.Iss, _config["JWT:Issuer"])
                //    }),
                //    Expires = DateTime.UtcNow.AddDays(30),
                //    SigningCredentials = new SigningCredentials
                //        (new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                //};
                //var token = tokenHandler.CreateToken(tokenDescriptor);
                //var jwtToken = tokenHandler.WriteToken(token);
                //var rfToken = GenerateRefreshToken();
                //var tokens = new Tokens
                //{
                //    AccessToken = jwtToken,
                //    RefreshToken = GenerateRefreshToken()
                //};
                var jwtToken = GenerateJWTTokens(user.Id.ToString(), user.RoleId.ToString());
                UserRefreshTokens rfToken = new UserRefreshTokens()
                {
                    RefreshToken = jwtToken.RefreshToken,
                    UserName = user.Username,
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddHours(24)
                };
                //await _context.UserRefreshTokens.AddAsync(rfToken);
                //await _context.SaveChangesAsync();
                var key = CreateCacheKey.BuildUserCacheKey(user.Id);
                var saveRfToken = JsonSerializer.Serialize(rfToken);
                await _redisService.SetValueWithExpiryAsync(key, saveRfToken, TimeSpan.FromHours(24));
                var userInfo = new User
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    RoleId = user.RoleId,
                    PhoneNumber = user.PhoneNumber,
                };
                return Tuple.Create(jwtToken, userInfo);
            }
            else
            {
                throw new ArgumentException("Wrong email or password");
            }
        }

        public async Task<Tokens> Refresh(Tokens tokens)
        {
            var principal = GetPrincipalFromExpiredToken(tokens.AccessToken);
            var userId = int.Parse(principal.Identity.Name);
            var user = await _context.Users.FindAsync(userId);
            var roleId = user.RoleId;
            //var savedRefreshToken = await _context.UserRefreshTokens.FirstOrDefaultAsync(
            //    u => u.UserName == user.Username && u.RefreshToken == tokens.RefreshToken && u.IsActived == true
            //);
            var key = CreateCacheKey.BuildUserCacheKey(userId);
            var savedRefreshToken = await _redisService.GetValueAsync(key);
            //if (
            //    savedRefreshToken?.RefreshToken != tokens.RefreshToken
            //    || savedRefreshToken?.RefreshTokenExpiryTime <= DateTime.UtcNow
            //)
            //{
            //    throw new BadRequestException("Invalid attempt!");
            //}
            if (savedRefreshToken != tokens.RefreshToken || string.IsNullOrEmpty(savedRefreshToken))
            {
                throw new BadRequestException("Invalid refresh token");
            }
            var newJwtToken = GenerateJWTTokens(user.Id.ToString(), roleId.ToString());
            if (newJwtToken == null)
            {
                throw new BadRequestException("Invalid attempt!");
            }
            var rfToken = JsonSerializer.Serialize(new UserRefreshTokens
            {
                RefreshToken = newJwtToken.RefreshToken,
                UserName = user.Username,
                RefreshTokenExpiryTime = DateTime.UtcNow.AddHours(24)
            });
            //UserRefreshTokens item = await _context.UserRefreshTokens.FirstOrDefaultAsync(
            //    u => u.UserName == user.Username && u.RefreshToken == tokens.RefreshToken
            //);
            //if (item != null)
            //{
            //    _context.UserRefreshTokens.Remove(item);
            //    await _context.UserRefreshTokens.AddAsync(rfToken);
            //    await _context.SaveChangesAsync();
            //}
            await _redisService.SetValueWithExpiryAsync(key, rfToken, TimeSpan.FromHours(24));
            return newJwtToken;
        }

        public async Task Logout(Tokens tokens)
        {
            //var rfToken = await _context.UserRefreshTokens.FirstOrDefaultAsync(u => u.RefreshToken == tokens.RefreshToken);
            //if (rfToken == null)
            //{
            //    throw new NotFoundException("Invalid refresh token");
            //}
            //_context.UserRefreshTokens.Remove(rfToken);
            //await _context.SaveChangesAsync();
            // Truy xuất userId từ access token
            var principal = GetPrincipalFromExpiredToken(tokens.AccessToken);
            var userId = int.Parse(principal.Identity.Name);

            // Xây dựng key cho Redis
            var key = CreateCacheKey.BuildUserCacheKey(userId);

            // Lấy giá trị từ Redis
            var rfTokenJson = await _redisService.GetValueAsync(key);
            if (string.IsNullOrEmpty(rfTokenJson))
            {
                throw new NotFoundException("Invalid refresh token");
            }

            var savedRefreshToken = JsonSerializer.Deserialize<UserRefreshTokens>(rfTokenJson);

            // Kiểm tra refresh token
            if (savedRefreshToken?.RefreshToken != tokens.RefreshToken)
            {
                throw new NotFoundException("Invalid refresh token");
            }

            // Xóa refresh token khỏi Redis
            await _redisService.RemoveValueAsync(key);
        }

        public async Task AddRequest(ForgotPasswordRequest request)
        {
            await _context.ForgotPasswordRequests.AddAsync(request);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteExpiredRequests()
        {
            var currentTime = DateTime.UtcNow;
            var expiredRequests = await _context.ForgotPasswordRequests
                .Where(f => f.ExpirationTime < currentTime)
                .ToListAsync();
            if (expiredRequests.Count == 0)
            {
                throw new NotFoundException("Code is not found");
            }
            if (expiredRequests.Any())
            {
                _context.ForgotPasswordRequests.RemoveRange(expiredRequests);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveConfirmCode(ForgotPasswordRequest confirmCode)
        {
            if (confirmCode is null)
            {
                throw new NotFoundException("confirm code invalid");
            }
            _context.ForgotPasswordRequests.Remove(confirmCode);
            await _context.SaveChangesAsync();
        }

        public async Task<ForgotPasswordRequest> GetByUserNameAndCode(string username, string code)
        {
            return await _context.ForgotPasswordRequests.FirstOrDefaultAsync(f => f.Username == username && f.Code == code);
        }

        //public async Task<bool> IsUserExists(string username)
        //{
        //    var userExist = await _context.ForgotPasswordRequests.FirstOrDefaultAsync(f => f.Username == username);
        //    if (userExist == null)
        //    {
        //        return false;
        //    }
        //    return true;
        //}
        public void SendConfirmationEmail(string email, string confirmationCode)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["SmtpConfig:Username"]),
                Subject = "Xác nhận quên mật khẩu",
                Body = $"Mã xác nhận của bạn là: {confirmationCode}",
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            _smtpClient.Send(mailMessage);
        }



        public async Task ChangePassword(ChangePassworkDto user)
        {
            var existUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == user.Username);
            if (existUser != null && BCrypt.Net.BCrypt.Verify(user.OldPassword, existUser.Password))
            {
                existUser.Password = BCrypt.Net.BCrypt.HashPassword(user.NewPassword);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new BadRequestException("Invalid password or user does not exist.");
            }
        }

        public async Task ResetPassword(ResetPasswordDto user)
        {
            var ValidUser = await _context.Users.FirstOrDefaultAsync(
                u => u.Username == (user.Username)
            );
            if (ValidUser == null)
            {
                throw new NotFoundException("user not found");
            }
            ValidUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Entry(ValidUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        private Tokens GenerateJWTTokens(string userId, string roleId)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var secretKey = Encoding.UTF8.GetBytes(_config["JWT:SecretKey"]);
                var tokenDescriptor = new SecurityTokenDescriptor()
                {
                    Subject = new ClaimsIdentity(
                        new Claim[]
                        {
                            new Claim(ClaimTypes.Name, userId),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                            new Claim(JwtRegisteredClaimNames.Aud, _config["JWT:Audience"]),
                            new Claim(JwtRegisteredClaimNames.Iss, _config["JWT:Issuer"]),
                            new Claim(ClaimTypes.Role, roleId.ToString())
                        }
                    ),
                    Expires = DateTime.Now.AddHours(3),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(secretKey),
                        SecurityAlgorithms.HmacSha256Signature
                    )
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var refreshToken = GenerateRefreshToken();
                return new Tokens
                {
                    AccessToken = tokenHandler.WriteToken(token),
                    RefreshToken = refreshToken
                };
            }
            catch (Exception e)
            {
                return null;
            }
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var secretKey = Encoding.UTF8.GetBytes(_config["JWT:SecretKey"]);
            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                ClockSkew = TimeSpan.Zero
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(
                token,
                tokenValidationParameters,
                out SecurityToken securityToken
            );

            JwtSecurityToken jwtSecurityToken = securityToken as JwtSecurityToken;

            if (
                jwtSecurityToken == null
                || !jwtSecurityToken.Header.Alg.Equals(
                    SecurityAlgorithms.HmacSha256,
                    StringComparison.InvariantCultureIgnoreCase
                )
            )
            {
                throw new SecurityTokenException("Invalid token");
            }
            return principal;
        }
        public string GenerateRandomCode()
        {
            Random random = new Random();
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, 6).Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
