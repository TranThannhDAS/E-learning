using backend.Dtos;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class LMSContext : DbContext
    {
        public LMSContext(DbContextOptions<LMSContext> options)
           : base(options) { }

        public LMSContext() { }
        public virtual DbSet<Answer> Answers { get; set; }
        public virtual DbSet<Attemp> Attemps { get; set; }
        public virtual DbSet<Chapter> Chapters { get; set; }
        public virtual DbSet<Exam> Exams { get; set; }
        public virtual DbSet<ForgotPasswordRequest> ForgotPasswordRequests { get; set; }
        public virtual DbSet<Lesson> Lessons { get; set; }
        public virtual DbSet<Option> Options { get; set; }
        public virtual DbSet<Question> Questions { get; set; }
        public virtual DbSet<QuizQuestion> QuizQuestions { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Source> Sources { get; set; }
        public virtual DbSet<SubTopic> SubTopics { get; set; }
        public virtual DbSet<Topic> Topics { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserRefreshTokens> UserRefreshTokens { get; set; }
        public virtual DbSet<Serial> Serials { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<FavoriteSource> FavoriteSources { get; set; }

        public virtual DbSet<UserConnection> UserConnections { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(ul => new { ul.Username }).IsUnique();
            modelBuilder.Entity<Attemp>()
              .HasOne(a => a.Answer)
              .WithOne(a => a.Attemp)
              .HasForeignKey<Answer>(a => a.AttemptId);
            modelBuilder.Entity<Serial>()
              .HasIndex(s => s.LessonId)
              .IsUnique();
        }
    }
}
