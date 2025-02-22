﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Data;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(LMSContext))]
    partial class LMSContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("backend.Entities.Answer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("AttemptId")
                        .HasColumnType("int")
                        .HasColumnName("attempt_id");

                    b.Property<int?>("CorrectAnswer")
                        .HasColumnType("int")
                        .HasColumnName("correct_answer");

                    b.Property<DateTime?>("CreateAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("create_at");

                    b.Property<int?>("ExamId")
                        .HasColumnType("int")
                        .HasColumnName("exam_id");

                    b.Property<int?>("IncorrectAnswer")
                        .HasColumnType("int")
                        .HasColumnName("incorrect_answer");

                    b.Property<string>("Total")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("total");

                    b.Property<int?>("UserId")
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("AttemptId")
                        .IsUnique()
                        .HasFilter("[attempt_id] IS NOT NULL");

                    b.HasIndex("ExamId");

                    b.HasIndex("UserId");

                    b.ToTable("Answers");
                });

            modelBuilder.Entity("backend.Entities.Attemp", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("Index")
                        .HasColumnType("int")
                        .HasColumnName("index");

                    b.Property<string>("TimeTaken")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("time_taken");

                    b.Property<int?>("UserId")
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Attemps");
                });

            modelBuilder.Entity("backend.Entities.Chapter", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<int>("Index")
                        .HasColumnType("int")
                        .HasColumnName("Index");

                    b.Property<int>("SourceId")
                        .HasColumnType("int")
                        .HasColumnName("source_id");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("title");

                    b.HasKey("Id");

                    b.HasIndex("SourceId");

                    b.ToTable("Chapters");
                });

            modelBuilder.Entity("backend.Entities.Exam", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsStarted")
                        .HasColumnType("bit")
                        .HasColumnName("is_started");

                    b.Property<int>("MaxQuestion")
                        .HasColumnType("int")
                        .HasColumnName("max_question");

                    b.Property<int>("SourceId")
                        .HasColumnType("int")
                        .HasColumnName("source_id");

                    b.Property<bool>("Status")
                        .HasColumnType("bit")
                        .HasColumnName("status");

                    b.Property<int>("TimeLimit")
                        .HasColumnType("int")
                        .HasColumnName("time_limit");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("title");

                    b.HasKey("Id");

                    b.HasIndex("SourceId");

                    b.ToTable("Exams");
                });

            modelBuilder.Entity("backend.Entities.FavoriteSource", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsFavorite")
                        .HasColumnType("bit")
                        .HasColumnName("is_favorite");

                    b.Property<int>("SourceId")
                        .HasColumnType("int")
                        .HasColumnName("source_id");

                    b.Property<int>("UserId")
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("SourceId");

                    b.HasIndex("UserId");

                    b.ToTable("FavoriteSources");
                });

            modelBuilder.Entity("backend.Entities.ForgotPasswordRequest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Code")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ExpirationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("ForgotPasswordRequests");
                });

            modelBuilder.Entity("backend.Entities.Lesson", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Author")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("author");

                    b.Property<int>("ChapterId")
                        .HasColumnType("int")
                        .HasColumnName("chapter_id");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<bool>("Status")
                        .HasColumnType("bit")
                        .HasColumnName("status");

                    b.Property<string>("Thumbnail")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("thumbnail");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("title");

                    b.Property<string>("Video")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("video");

                    b.Property<string>("VideoDuration")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("video_duration");

                    b.Property<int>("View")
                        .HasColumnType("int")
                        .HasColumnName("view");

                    b.HasKey("Id");

                    b.HasIndex("ChapterId");

                    b.ToTable("Lessons");
                });

            modelBuilder.Entity("backend.Entities.Option", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Answer")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("answer");

                    b.Property<bool>("IsCorrect")
                        .HasColumnType("bit")
                        .HasColumnName("is_correct");

                    b.Property<int>("QuestionId")
                        .HasColumnType("int")
                        .HasColumnName("question_id");

                    b.HasKey("Id");

                    b.HasIndex("QuestionId");

                    b.ToTable("Options");
                });

            modelBuilder.Entity("backend.Entities.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("CreatedAt");

                    b.Property<string>("PaymentID")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("PaymentID");

                    b.Property<int>("SouresID")
                        .HasColumnType("int")
                        .HasColumnName("SouresID");

                    b.Property<bool>("Status")
                        .HasColumnType("bit")
                        .HasColumnName("Status");

                    b.Property<double>("TotalPrice")
                        .HasColumnType("float")
                        .HasColumnName("TotalPrice");

                    b.Property<int>("UserID")
                        .HasColumnType("int")
                        .HasColumnName("UserID");

                    b.HasKey("Id");

                    b.HasIndex("SouresID");

                    b.HasIndex("UserID");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("backend.Entities.Question", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Content")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("content");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("image");

                    b.HasKey("Id");

                    b.ToTable("Questions");
                });

            modelBuilder.Entity("backend.Entities.QuizQuestion", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ExamId")
                        .HasColumnType("int")
                        .HasColumnName("exam_id");

                    b.Property<int>("QuestionId")
                        .HasColumnType("int")
                        .HasColumnName("question_id");

                    b.HasKey("Id");

                    b.HasIndex("ExamId");

                    b.HasIndex("QuestionId");

                    b.ToTable("QuizQuestions");
                });

            modelBuilder.Entity("backend.Entities.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("role_name");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("backend.Entities.Serial", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("ExamId")
                        .HasColumnType("int")
                        .HasColumnName("exam_id");

                    b.Property<int?>("Index")
                        .HasColumnType("int")
                        .HasColumnName("index");

                    b.Property<int?>("LessonId")
                        .HasColumnType("int")
                        .HasColumnName("lesson_id");

                    b.HasKey("Id");

                    b.HasIndex("ExamId");

                    b.HasIndex("LessonId")
                        .IsUnique()
                        .HasFilter("[lesson_id] IS NOT NULL");

                    b.ToTable("Serials");
                });

            modelBuilder.Entity("backend.Entities.Source", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Benefit")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("benefit");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<double>("Price")
                        .HasColumnType("float")
                        .HasColumnName("price");

                    b.Property<string>("Rating")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("rating");

                    b.Property<string>("Requirement")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("requirement");

                    b.Property<string>("Slug")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("slug");

                    b.Property<bool>("Status")
                        .HasColumnType("bit")
                        .HasColumnName("status");

                    b.Property<int?>("SubTopicId")
                        .HasColumnType("int")
                        .HasColumnName("sub_topic_id");

                    b.Property<string>("Thumbnail")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("thumbnail");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("title");

                    b.Property<int?>("UserId")
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    b.Property<string>("VideoIntro")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("video_intro");

                    b.HasKey("Id");

                    b.HasIndex("SubTopicId");

                    b.HasIndex("UserId");

                    b.ToTable("Sources");
                });

            modelBuilder.Entity("backend.Entities.SubTopic", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("SubTopicName")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("sub_topic_name");

                    b.Property<int?>("TopicId")
                        .HasColumnType("int")
                        .HasColumnName("topic_id");

                    b.HasKey("Id");

                    b.HasIndex("TopicId");

                    b.ToTable("SubTopics");
                });

            modelBuilder.Entity("backend.Entities.Topic", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("TopicName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("topic_name");

                    b.HasKey("Id");

                    b.ToTable("Topics");
                });

            modelBuilder.Entity("backend.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Avatar")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("avatar");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("email");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)")
                        .HasColumnName("password");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("phone_number");

                    b.Property<int>("RoleId")
                        .HasColumnType("int")
                        .HasColumnName("role_id");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasColumnName("username");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("backend.Entities.UserConnection", b =>
                {
                    b.Property<string>("ConnectionId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("ConnectedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DisconnectedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<int?>("ExamId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("ConnectionId");

                    b.HasIndex("ExamId");

                    b.HasIndex("UserId");

                    b.ToTable("UserConnections");
                });

            modelBuilder.Entity("backend.Entities.UserRefreshTokens", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsActived")
                        .HasColumnType("bit");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("RefreshTokenExpiryTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("UserRefreshTokens");
                });

            modelBuilder.Entity("backend.Entities.Answer", b =>
                {
                    b.HasOne("backend.Entities.Attemp", "Attemp")
                        .WithOne("Answer")
                        .HasForeignKey("backend.Entities.Answer", "AttemptId");

                    b.HasOne("backend.Entities.Exam", "Exam")
                        .WithMany("Answers")
                        .HasForeignKey("ExamId");

                    b.HasOne("backend.Entities.User", "User")
                        .WithMany("Answers")
                        .HasForeignKey("UserId");

                    b.Navigation("Attemp");

                    b.Navigation("Exam");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Entities.Attemp", b =>
                {
                    b.HasOne("backend.Entities.User", "User")
                        .WithMany("Attemps")
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Entities.Chapter", b =>
                {
                    b.HasOne("backend.Entities.Source", "Source")
                        .WithMany("Chapters")
                        .HasForeignKey("SourceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Source");
                });

            modelBuilder.Entity("backend.Entities.Exam", b =>
                {
                    b.HasOne("backend.Entities.Source", "Source")
                        .WithMany("Exams")
                        .HasForeignKey("SourceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Source");
                });

            modelBuilder.Entity("backend.Entities.FavoriteSource", b =>
                {
                    b.HasOne("backend.Entities.Source", "Source")
                        .WithMany("FavoriteSources")
                        .HasForeignKey("SourceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Entities.User", "User")
                        .WithMany("FavoriteSources")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Source");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Entities.Lesson", b =>
                {
                    b.HasOne("backend.Entities.Chapter", "Chapter")
                        .WithMany("Lessions")
                        .HasForeignKey("ChapterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Chapter");
                });

            modelBuilder.Entity("backend.Entities.Option", b =>
                {
                    b.HasOne("backend.Entities.Question", "Question")
                        .WithMany("Options")
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Question");
                });

            modelBuilder.Entity("backend.Entities.Order", b =>
                {
                    b.HasOne("backend.Entities.Source", "Soures")
                        .WithMany()
                        .HasForeignKey("SouresID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Soures");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Entities.QuizQuestion", b =>
                {
                    b.HasOne("backend.Entities.Exam", "Exam")
                        .WithMany("QuizQuestions")
                        .HasForeignKey("ExamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Entities.Question", "Question")
                        .WithMany("QuizQuestions")
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Exam");

                    b.Navigation("Question");
                });

            modelBuilder.Entity("backend.Entities.Serial", b =>
                {
                    b.HasOne("backend.Entities.Exam", null)
                        .WithMany("Serials")
                        .HasForeignKey("ExamId");

                    b.HasOne("backend.Entities.Lesson", null)
                        .WithMany("Serials")
                        .HasForeignKey("LessonId");
                });

            modelBuilder.Entity("backend.Entities.Source", b =>
                {
                    b.HasOne("backend.Entities.SubTopic", "SubTopic")
                        .WithMany("Sources")
                        .HasForeignKey("SubTopicId");

                    b.HasOne("backend.Entities.User", "User")
                        .WithMany("Sources")
                        .HasForeignKey("UserId");

                    b.Navigation("SubTopic");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Entities.SubTopic", b =>
                {
                    b.HasOne("backend.Entities.Topic", "Topic")
                        .WithMany("subTopics")
                        .HasForeignKey("TopicId");

                    b.Navigation("Topic");
                });

            modelBuilder.Entity("backend.Entities.User", b =>
                {
                    b.HasOne("backend.Entities.Role", null)
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("backend.Entities.UserConnection", b =>
                {
                    b.HasOne("backend.Entities.Exam", "Exam")
                        .WithMany("Users")
                        .HasForeignKey("ExamId");

                    b.HasOne("backend.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Exam");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Entities.Attemp", b =>
                {
                    b.Navigation("Answer");
                });

            modelBuilder.Entity("backend.Entities.Chapter", b =>
                {
                    b.Navigation("Lessions");
                });

            modelBuilder.Entity("backend.Entities.Exam", b =>
                {
                    b.Navigation("Answers");

                    b.Navigation("QuizQuestions");

                    b.Navigation("Serials");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("backend.Entities.Lesson", b =>
                {
                    b.Navigation("Serials");
                });

            modelBuilder.Entity("backend.Entities.Question", b =>
                {
                    b.Navigation("Options");

                    b.Navigation("QuizQuestions");
                });

            modelBuilder.Entity("backend.Entities.Role", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("backend.Entities.Source", b =>
                {
                    b.Navigation("Chapters");

                    b.Navigation("Exams");

                    b.Navigation("FavoriteSources");
                });

            modelBuilder.Entity("backend.Entities.SubTopic", b =>
                {
                    b.Navigation("Sources");
                });

            modelBuilder.Entity("backend.Entities.Topic", b =>
                {
                    b.Navigation("subTopics");
                });

            modelBuilder.Entity("backend.Entities.User", b =>
                {
                    b.Navigation("Answers");

                    b.Navigation("Attemps");

                    b.Navigation("FavoriteSources");

                    b.Navigation("Sources");
                });
#pragma warning restore 612, 618
        }
    }
}
