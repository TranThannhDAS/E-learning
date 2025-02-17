using backend.Base;
using backend.Data;
using backend.Service;
using backend.Service.Interface;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

namespace backend.Extentions
{
    public static class ApplicationServicesExtention
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddScoped<IElasticSearchRepository, ElasticSearchRepository>();
            services.AddScoped<LMSContext>();
            services.AddScoped<IAnswerService, AnswerService>();
            services.AddScoped<IAttempService, AttempService>();
            services.AddScoped<IChapterService, ChapterService>();
            services.AddScoped<IExamService, ExamService>();
            services.AddScoped<ILessonService, LessonService>();
            services.AddScoped<IOptionService, OptionService>();
            services.AddScoped<IQuestionService, QuestionService>();
            services.AddScoped<IQuizQuestionService, QuizQuestionService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<ISourceService, SourceService>();
            services.AddScoped<ISubTopicService, SubTopicService>();
            services.AddScoped<ITopicService, TopicService>();
            services.AddScoped<ICartService, CartService>();
            /*            services.AddScoped<IChukedFileService, ChunkedFileService>();
            */
            services.AddScoped<IOrderService, OrderService>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ISerialService, SerialService>();
            services.AddScoped<IimageServices, ImageServices>();
            services.AddScoped<IFavoriteService, FavoriteService>();
            services.AddAutoMapper(typeof(CreateAutoMapper));

            services.AddTransient<IRedisService, RedisService>();

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = acttionContext =>
                {
                    var errors = acttionContext.ModelState
                        .Where(e => e.Value?.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToArray();
                    var errorResponse = new APIValidationError
                    {
                        Errors = errors,
                        Message = "Validation failed"
                    };
                    return new BadRequestObjectResult(errorResponse);
                };
            });

            return services;
        }
    }
}
