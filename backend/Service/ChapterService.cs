using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class ChapterService(LMSContext context, ILessonService lessonService) : IChapterService
    {
        private readonly LMSContext _context = context;
        private readonly ILessonService _lessonService = lessonService;

        private async Task<int> GetMaxIndex(int SourceID)
        {
            var query = from chapter in _context.Chapters
                        join source in _context.Sources on chapter.SourceId equals source.Id
                        where chapter.SourceId == SourceID
                        select chapter.Index;

            return await query.AnyAsync() ? await query.MaxAsync() : 0;
        }

        private async Task<List<Chapter>> GetChapterGTE(int? Index, int SourceID)
        {
            var chapters = await (from chapter in _context.Chapters
                                  join source in _context.Sources on chapter.SourceId equals source.Id
                                  where chapter.Index >= Index && chapter.SourceId == SourceID
                                  select chapter).ToListAsync();
            return chapters;
        }
        public async Task<Chapter> CreateAsync(ChapterDtoUpdate chapter)
        {
            //int maxIndex = await GetMaxIndex(chapter.SourceId);
            //if (chapter.Index > maxIndex)
            //{
            //    chapter.Index = maxIndex + 1;
            //}
            //else
            //{
            //    var chaptersToUpdate = await GetChapterGTE(chapter.Index, chapter.SourceId);
            //    foreach (var c in chaptersToUpdate)
            //    {
            //        c.Index++;
            //    }
            //}
            var chapter1 = new Chapter
            {
                Description = chapter.Description,
                Index = (int)chapter.Index,
                SourceId = chapter.SourceId,
                Title = chapter.Title
            };
            _context.Chapters.Add(chapter1);
            await _context.SaveChangesAsync();
            return chapter1;
        }

        public async Task<List<Chapter>> GetAllAsync()
        {
            return await _context.Chapters.ToListAsync();
        }
        public async Task<(List<Chapter>, int)> GetAllAsync(Pagination pagination)
        {
            var chapters = await _context.Chapters
                //.Include(c => c.Source) // Includes the source of the chapter
                //.Include(c => c.Lessions) // Includes all lessons in the chapter
                //.Include(c => c.Exams) // Includes all exams in the chapter
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();
            var count = await _context.Chapters.CountAsync();
            return (chapters, count);
        }

        public async Task<Chapter?> GetByIdAsync(int id)
        {
            return await _context.Chapters
                //.Include(c => c.Source)
                //.Include(c => c.Lessions)
                //.Include(c => c.Exams)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Chapter?> UpdateAsync(int id, ChapterDtoUpdate updatedChapter)
        {
            var chapter = await _context.Chapters.FindAsync(id);
            if (chapter == null) return null;

            //if (chapter.Index != updatedChapter.Index)
            //{
            //    int minIndex = Math.Min((int)chapter.Index, (int)updatedChapter.Index);
            //    int maxIndex = Math.Max((int)chapter.Index, (int)updatedChapter.Index);
            //    var GetChapter = await _context.Chapters.Where(c => c.SourceId == chapter.SourceId && c.Index >= minIndex && c.Index <= maxIndex && c.Id != chapter.Id).ToListAsync();

            //    if (chapter.Index > updatedChapter.Index)
            //    {
            //        GetChapter.ForEach(s => s.Index++);
            //    }
            //    else
            //    {
            //        GetChapter.ForEach(s => s.Index--);
            //    }
            //}
            chapter.Index = (int)updatedChapter.Index;
            chapter.Title = updatedChapter.Title;
            chapter.Description = updatedChapter.Description;
            //chapter.SourceId = updatedChapter.SourceId;
            // This operation does not handle changes to relations like Lessions or Exams, which might require additional logic

            await _context.SaveChangesAsync();
            return chapter;
        }
        private async Task<List<Chapter>> GetChapterGByIndex(int Index, int SourceID)
        {
            var result = await (from chapter in _context.Chapters
                                where chapter.Index > Index && chapter.SourceId == SourceID
                                select chapter).ToListAsync();
            return result;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var chapter = await _context.Chapters.FindAsync(id);
            if (chapter == null) return false;
            // xóa lession theo chapter
            var list_lession = await _context.Lessons.Where(l => l.ChapterId == id).ToListAsync();
            if (list_lession != null)
            {
                foreach (var item in list_lession)
                {
                    await _lessonService.DeleteAsync(item.Id);
                }
                //_context.Lessons.RemoveRange(list_lession);
            }
            //var chapters = await GetChapterGByIndex(chapter.Index, chapter.SourceId);
            //foreach (var chapter1 in chapters)
            //{
            //    chapter1.Index--;
            //}

            _context.Chapters.Remove(chapter);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> GetChapterBySourceID(int sourceID)
        {
            var result = await (from chapter in _context.Chapters
                                where chapter.SourceId == sourceID
                                select chapter).OrderBy(p => p.Index).ToListAsync();
            return result;
        }
    }

}
