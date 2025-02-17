using AutoMapper;
using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Net.WebSockets;

namespace backend.Service
{
    public class LessonService(ISerialService serialService, IWebHostEnvironment env, LMSContext context, IMapper mapper, IimageServices iimageServices) : ILessonService
    {
        private readonly LMSContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly IWebHostEnvironment _env = env;
        private readonly IimageServices _imageServices = iimageServices;
        private readonly ISerialService _serialService = serialService;
        private static readonly string[] AllowedVideoExtensions = { ".mp4", ".avi", ".mov", ".wmv" };
        private void ProcessVideoFile(string fileVideoNameSource)
        {
            if (!string.IsNullOrEmpty(fileVideoNameSource))
            {
                if (!IsValidVideoFile(fileVideoNameSource))
                {
                    throw new Exception("Invalid video file.");
                }
                string tempPath = Path.Combine(_env.WebRootPath, "Temp");
                string newPath = Path.Combine(tempPath, fileVideoNameSource);
                string[] filePaths = Directory.GetFiles(tempPath).Where(p => p.Contains(fileVideoNameSource)).OrderBy(p => Int32.Parse(p.Replace(fileVideoNameSource, "$").Split('$')[1])).ToArray();
                foreach (string filePath in filePaths)
                {
                    MergeChunks(newPath, filePath);
                }
                System.IO.File.Move(Path.Combine(tempPath, fileVideoNameSource), Path.Combine(_env.WebRootPath, fileVideoNameSource));
            }
        }
        private bool IsValidVideoFile(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return AllowedVideoExtensions.Contains(extension);
        }

        private static void MergeChunks(string chunk1, string chunk2)
        {
            FileStream fs1 = null;
            FileStream fs2 = null;
            try
            {
                fs1 = System.IO.File.Open(chunk1, FileMode.Append);
                fs2 = System.IO.File.Open(chunk2, FileMode.Open);
                byte[] fs2Content = new byte[fs2.Length];
                fs2.Read(fs2Content, 0, (int)fs2.Length);
                fs1.Write(fs2Content, 0, (int)fs2.Length);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " : " + ex.StackTrace);
            }
            finally
            {
                if (fs1 != null) fs1.Close();
                if (fs2 != null) fs2.Close();
                System.IO.File.Delete(chunk2);
            }
        }
        public async Task<LessonDto> CreateAsync(LessonDtoCreate lessonDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var lesson = _mapper.Map<Lesson>(lessonDto);

                    // Xử lý video lớn
                    if (lessonDto.FileVideoNameSource != null)
                    {
                        ProcessVideoFile(lessonDto.FileVideoNameSource);
                        lesson.Video = lessonDto.FileVideoNameSource;
                    }
                    _context.Lessons.Add(lesson);
                    await _context.SaveChangesAsync();

                    var serialDto = new SerialDtoCreate
                    {
                        Index = lessonDto.Index,
                        Lesson_ID = lesson.Id,
                        Exam_ID = lessonDto.Exam_ID,
                        Chapter_ID = lessonDto.ChapterId
                    };
                    var result = await _serialService.CreateSerial(serialDto);

                    await transaction.CommitAsync();

                    return lessonDto;
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }


        public async Task<(List<LessonDto>, int)> GetAllAsync(Pagination pagination)
        {
            var lessons = await _context.Lessons
                //.Include(l => l.Chapter) // Include the chapter details
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                 .Take(pagination.PageSize)
                .ToListAsync();
            var count = await _context.Lessons.CountAsync();
            return (_mapper.Map<List<LessonDto>>(lessons), count);
        }
        public async Task<object> GetAllAsync(int chapterID)
        {
            var query = await (from lesson in _context.Lessons
                               join chapter in _context.Chapters on lesson.ChapterId equals chapter.Id
                               join serial in _context.Serials on lesson.Id equals serial.LessonId
                               where lesson.ChapterId == chapterID
                               group new { lesson, serial } by lesson.ChapterId into g
                               select new
                               {
                                   Chapter = g.Key,
                                   Lesson = g.Select(g => new
                                   {
                                       id = g.lesson.Id,
                                       index = g.serial.Index,
                                       title = g.lesson.Title,
                                       author = g.lesson.Author,
                                       videoDuration = g.lesson.VideoDuration,
                                       thumbnail = g.lesson.Thumbnail,
                                       video = g.lesson.Video != null ? _imageServices.GetFile(g.lesson.Video) : null,
                                       fileVideoNameSource = g.lesson.Video != null ? System.IO.Path.GetFileName(g.lesson.Video) : null,
                                       view = g.lesson.View,
                                       status = g.lesson.Status,
                                       description = g.lesson.Description,
                                       examID = g.serial.ExamId
                                   })
                               }).ToListAsync();

            return query;
        }
        public async Task<(LessonDtoDetail?,int?)> GetByIdAsync(int id)
        {
            var lesson = await _context.Lessons
                //.Include(l => l.Chapter) // Include the chapter to which the lesson belongs
                .FirstOrDefaultAsync(l => l.Id == id);
            if(lesson == null)
            {
                throw new Exception("lesson not found");
            }
            lesson.Video = lesson.Video != null ? _imageServices.GetFile(lesson.Video) : null;
            var serial = await _context.Serials.FirstOrDefaultAsync(s => s.LessonId == id);
            var detail = _mapper.Map<LessonDtoDetail> (lesson);
            detail.ExamId = serial.ExamId;
            return (detail,serial.Index);
        }
        public async Task<int> GetSerialIDbyLessonID(int lessonId)
        {
            var serial = await _context.Serials.FirstOrDefaultAsync(s => s.LessonId == lessonId);
            return serial.Id;
        }
        public async Task<LessonDto?> UpdateAsync(int id, LessonDtoUpdate updatedLesson)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var update = _mapper.Map<Lesson>(updatedLesson);
                    var lesson = await _context.Lessons.FindAsync(id);
                    if (lesson == null) return null;

                    if (!String.IsNullOrEmpty(updatedLesson.FileVideoNameSource))
                    {
                        bool check = true;
                        if (lesson.Video != null)
                        {
                            string result = _imageServices.DeleteFile(lesson.Video);
                            if (result.Contains("failed"))
                            {
                                check = false;
                            }
                        }

                        if (check)
                        {
                            ProcessVideoFile(updatedLesson.FileVideoNameSource);
                            lesson.Video = updatedLesson.FileVideoNameSource;
                        }
                    }

                    lesson.Title = update.Title;
                    lesson.Author = update.Author;
                    lesson.VideoDuration = update.VideoDuration;
                    lesson.View = update.View;
                    lesson.Status = update.Status;
                    lesson.ChapterId = update.ChapterId;
                    lesson.Description = update.Description;

                    await _context.SaveChangesAsync();
                    var serial = new SerialDtoUpdate
                    {
                        Lesson_ID = id,
                        ChapterID = updatedLesson.ChapterId,
                        Exam_ID = updatedLesson.serialDto.Exam_ID,
                        Index = updatedLesson.serialDto.Index
                    };
                    await _serialService.UpdateSerial(serial);

                    await transaction.CommitAsync();

                    return updatedLesson;
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }


        public async Task<bool> DeleteAsync(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var lesson = await _context.Lessons.FindAsync(id);
                    if (lesson == null) return false;

                    if (!string.IsNullOrEmpty(lesson.Video))
                    {
                        string result = _imageServices.DeleteFile(lesson.Video);
                        if (result.Contains("failed"))
                        {
                            return false;
                        }
                    }
                    _context.Lessons.Remove(lesson);

                    /*   var serials = await _context.Serials.FirstOrDefaultAsync(s => s.LessonId == id);
                       if (serials != null)
                       {
                           _context.Serials.Remove(serials);
                       }*/

                    //var serialID = await GetSerialIDbyLessonID(id);
                    bool check = await _serialService.DeleteAsync(id);

                    if (!check)
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<LessonDto> UpdateView (int lessonId)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if(lesson == null)
            {
                throw new Exception("not found lesson");
            }
            lesson.View++;
            await _context.SaveChangesAsync();
            return _mapper.Map<LessonDto>(lesson);
        }

    }

}
