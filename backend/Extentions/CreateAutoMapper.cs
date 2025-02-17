using AutoMapper;
using backend.Dtos;
using backend.Dtos.UserDto;
using backend.Entities;

namespace backend.Extentions
{
    public class CreateAutoMapper : Profile
    {
        public CreateAutoMapper() { 

            CreateMap<Answer, AnswerDto>().ReverseMap();

            CreateMap<Attemp, AttempDto>().ReverseMap();

            CreateMap<Chapter, ChapterDto>().ReverseMap();

            CreateMap<Exam, ExamDto>().ReverseMap();

            CreateMap<Lesson, LessonDto>().ReverseMap();
            CreateMap<Lesson, LessonDtoDetail>().ReverseMap();

            CreateMap<Option, OptionDto>().ReverseMap();

            CreateMap<Question, QuestionDto>().ReverseMap();
            CreateMap<Question, QuestionViewModel>().ReverseMap();

            CreateMap<QuizQuestion, QuizQuestionDto>().ReverseMap();

            CreateMap<Source, SourceDto>().ReverseMap();
            CreateMap<Source, SourceViewDto>().ReverseMap();
            CreateMap<SourceViewDto,SourceWithTopicId>().ReverseMap();

            CreateMap<SubTopic, SubTopicDto>().ReverseMap();

            CreateMap<Topic, TopicDto>().ReverseMap();

            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserRegisterDto>().ReverseMap();
            CreateMap<User, ListUserDto>().ReverseMap();
            CreateMap<User, UserViewModel>().ReverseMap();
        }
    }
}
