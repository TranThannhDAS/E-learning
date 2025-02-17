using backend.Base;
using backend.Dtos;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface ILessonService
    {
        Task<LessonDto> CreateAsync(LessonDtoCreate lessonDto);
        Task<bool> DeleteAsync(int id);
        Task<(List<LessonDto>, int)> GetAllAsync(Pagination pagination);
        Task<object> GetAllAsync(int chapterID);
        Task<(LessonDtoDetail?,int?)> GetByIdAsync(int id);
        Task<LessonDto?> UpdateAsync(int id, LessonDtoUpdate updatedLesson);
        Task<LessonDto> UpdateView(int lessonId);
    }
}
