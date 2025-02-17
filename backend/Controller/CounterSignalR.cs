using backend.Entities;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics.Metrics;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Timers;
using Timer = System.Timers.Timer;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Threading;

namespace backend.Controller
{
    public class CounterSignalR : Hub
    {
        public async Task SendTimer(int CounterTime)
        {
            string connectionId = Context.ConnectionId;

            for (int i = 0; i < CounterTime; i++)
            {
                await Task.Delay(1000);
            }
            await Clients.Client(connectionId).SendAsync("TimerEnded");
        }
    }
}
