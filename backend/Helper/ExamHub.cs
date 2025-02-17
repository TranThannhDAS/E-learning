using backend.Data;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace backend.Helper
{
    public class ExamHub : Hub
    {
        private readonly LMSContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        //private static Dictionary<int, (System.Timers.Timer Timer, DateTime EndTime)> _examTimers = new Dictionary<int, (System.Timers.Timer, DateTime)>();
        private readonly IExamService _examService;
        //private static Dictionary<int, bool> _continueExams = new Dictionary<int, bool>();
        private readonly IRedisService _redisService;
        public ExamHub(LMSContext context, IExamService examService, IRedisService redisService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _examService = examService;
            _redisService = redisService;
            _httpContextAccessor = httpContextAccessor;
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            //var userId = (int)_httpContextAccessor.HttpContext.Items["UserId"];
            //var userId = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userId = (int)Context.Items["UserId"];
            // Giả sử bạn có thể trích xuất ID người dùng từ context
            //var userConnection = await _context.UserConnections
            //   .OrderByDescending(x => x.ConnectedAt)
            //   .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.DisconnectedAt == null);  // Giả định UserId = 1
            var cacheKey = CreateCacheKey.BuildUserConnectionCacheKey(userId);
            var userConnectionJson = await _redisService.GetValueAsync(cacheKey);
            if (userConnectionJson != null)
            {
                var userConnection = JsonSerializer.Deserialize<UserConnection>(userConnectionJson);
                userConnection.DisconnectedAt = DateTime.UtcNow;

                // Cập nhật lại cache với thông tin DisconnectedAt
                var updatedUserConnectionJson = JsonSerializer.Serialize(userConnection);
                await _redisService.SetValueWithExpiryAsync(cacheKey, updatedUserConnectionJson, userConnection.EndTime - DateTime.UtcNow);

                await _examService.EndExam((int)userConnection.ExamId, userId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task StartExam(int examId, int userId)
        {
            //var userId = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            Context.Items["UserId"] = userId;
            var exam = await _context.Exams.FirstOrDefaultAsync(e => e.Id == examId);

            if (exam == null || exam.IsStarted)
            {
                throw new Exception("Không tìm thấy kỳ thi hoặc kỳ thi đã bắt đầu.");
            }

            //exam.IsStarted = true;
            //await _context.SaveChangesAsync();
            var now = DateTime.UtcNow;
            var endTime = now.AddMinutes(exam.TimeLimit);
            var userConnection = new UserConnection
            {
                ConnectionId = Context.ConnectionId,
                UserId = userId,
                ConnectedAt = now,
                EndTime = endTime,
                ExamId = examId
            };

            //_context.UserConnections.Add(userConnection);
            //await _context.SaveChangesAsync();
            var cacheKey = CreateCacheKey.BuildUserConnectionCacheKey(userId);
            var userConnectionJson = JsonSerializer.Serialize(userConnection);
            await _redisService.SetValueWithExpiryAsync(cacheKey, userConnectionJson, TimeSpan.FromMinutes(exam.TimeLimit+3));
            while (DateTime.UtcNow < endTime)
            {
                var remainingTime = endTime - DateTime.UtcNow;
                var formattedTime = $"{remainingTime.Minutes:D2}:{remainingTime.Seconds:D2}";
                await Clients.Client(Context.ConnectionId).SendAsync("ReceiveTimeUpdate", formattedTime);
                await Task.Delay(1000); // Đợi một giây
            }

            // Kết thúc kỳ thi khi thời gian hết
            await _examService.EndExam(examId, userId);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveExamEnd");
        }
       

        public async Task EndExam( int examId ,int userId)
        {
            //var userId =
            //    int.Parse(Context.User.Identity.Name);

            await _examService.EndExam(examId, userId);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveExamEnd");
            //await Clients.User(userId.ToString()).SendAsync("ReceiveExamEnd");
            //await _hubContext.Clients.Client(userConnection.ConnectionId).SendAsync("ReceiveExamEnd");
        }
    }
}
