using backend.Data;

namespace backend.Worker
{
    public class CleanupUserConnectionService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _delay = TimeSpan.FromDays(1);  // Kiểm tra mỗi ngày

        public CleanupUserConnectionService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(_delay, stoppingToken);

                await CleanUpOldConnections();
            }
        }

        private async Task CleanUpOldConnections()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<LMSContext>();

                var cutoffDate = DateTime.UtcNow.AddDays(-30);  // Xóa các bản ghi cách đây 5 ngày

                var oldConnections = context.UserConnections
                    .Where(c => c.DisconnectedAt.HasValue && c.DisconnectedAt < cutoffDate);

                context.UserConnections.RemoveRange(oldConnections);
                await context.SaveChangesAsync();
            }
        }
    }
}
