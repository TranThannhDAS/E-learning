using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace backend.Service
{
    public class SerialService(LMSContext context) : ISerialService
    {
        private readonly LMSContext _context = context;

        private async Task<int?> MaxIndexByChapterId(int? chapterId)
        {
            var maxIndex = context.Lessons
          .Join(context.Chapters,
                les => les.ChapterId,
                chapter => chapter.Id,
                (les, chapter) => new { les, chapter })
          .Join(context.Serials,
                combined => combined.les.Id,
                serial => serial.LessonId,
                (combined, serial) => new { combined.les, combined.chapter, serial })
          .Where(x => x.les.ChapterId == chapterId)
          .Max(x => x.serial.Index);
            return maxIndex;
        }
        private async Task<int?> MaxIndexByChapterId(int? chapterId, int lessonID)
        {
            var maxIndex = context.Lessons
          .Join(context.Chapters,
                les => les.ChapterId,
                chapter => chapter.Id,
                (les, chapter) => new { les, chapter })
          .Join(context.Serials,
                combined => combined.les.Id,
                serial => serial.LessonId,
                (combined, serial) => new { combined.les, combined.chapter, serial })
          .Where(x => x.les.ChapterId == chapterId && x.les.Id != lessonID)
          .Max(x => x.serial.Index);
            return maxIndex;
        }
        private async Task<List<Serial>> GetSerialbyChpaterID(int chapterID, int Index)
        {
            var result = from serial in context.Serials
                         join lesson in context.Lessons on serial.LessonId equals lesson.Id
                         join chapter in context.Chapters on lesson.ChapterId equals chapter.Id
                         where lesson.ChapterId == chapterID && serial.Index >= Index
                         select (new Serial
                         {
                             Id = serial.Id,
                             Index = serial.Index,
                             LessonId = serial.LessonId,
                             ExamId = serial.ExamId
                         });

            var serialList = await result.ToListAsync();
            return serialList;
        }
        public async Task<Serial> CreateSerial(SerialDtoCreate newSerial)
        {
            var serial = new Serial();
            serial.Index = newSerial.Index;
            serial.LessonId = newSerial.Lesson_ID;
            serial.ExamId = newSerial.Exam_ID;

            if (serial.Index != null)
            {
                var maxIndex = await MaxIndexByChapterId(newSerial.Chapter_ID);

                if (serial.Index <= maxIndex)
                {
                    var serialsToUpdate = await GetSerialbyChpaterID((int)newSerial.Chapter_ID, serial.Index ?? 0);

                    serialsToUpdate.ForEach(s => s.Index++);
                    _context.UpdateRange(serialsToUpdate);

                }
                else
                {
                    serial.Index = maxIndex != null ? maxIndex + 1 : 1;
                }
                _context.Serials.Add(serial);
                await context.SaveChangesAsync();
            }

            return serial;
        }

        public async Task<List<Serial>> GetAllAsync()
        {
            return await _context.Serials.ToListAsync();
        }

        public async Task<Serial?> GetByIdAsync(int id)
        {
            return await _context.Serials
                .FirstOrDefaultAsync(st => st.Id == id);
        }
        private async Task<List<Serial>> GetSerialByChapterID(int chapter_ID, int minIndex, int maxIndex, int serialID)
        {
            var result = from serial in context.Serials
                         join lesson in context.Lessons on serial.LessonId equals lesson.Id
                         join chapter in context.Chapters on lesson.ChapterId equals chapter.Id
                         where lesson.ChapterId == chapter_ID && serial.Index >= minIndex && serial.Index <= maxIndex && serial.Id != serialID
                         select (new Serial
                         {
                             Id = serial.Id,
                             Index = serial.Index,
                             LessonId = serial.LessonId,
                             ExamId = serial.ExamId
                         });

            var serialList = await result.ToListAsync();
            return serialList;
        }
        public async Task<Serial?> UpdateSerial(SerialDtoUpdate updatedSerial)
        {
            var serial = await _context.Serials.FirstOrDefaultAsync(s => s.LessonId == updatedSerial.Lesson_ID);
            if (serial == null) return null;

            if (serial.Index != updatedSerial.Index)
            {
                // Determine the range of indices to update
                int minIndex = Math.Min(serial.Index ?? 1, updatedSerial.Index ?? 1);
                int maxIndex = Math.Max(serial.Index ?? 1, updatedSerial.Index ?? 1);

                var serialsToUpdate = await GetSerialByChapterID(updatedSerial.ChapterID, minIndex, maxIndex, serial.Id);
                if (serial.Index > updatedSerial.Index)
                {
                    serialsToUpdate.ForEach(s => s.Index++);
                }
                else
                {
                    serialsToUpdate.ForEach(s => s.Index--);
                }
                _context.UpdateRange(serialsToUpdate);
                await _context.SaveChangesAsync();
            }
            var maxIndexinChapter = await MaxIndexByChapterId(updatedSerial.ChapterID, updatedSerial.Lesson_ID);
            if (updatedSerial.Index > maxIndexinChapter)
            {
                updatedSerial.Index = maxIndexinChapter + 1;
            }
            serial.Index = updatedSerial.Index;
            serial.ExamId = updatedSerial.Exam_ID;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                // Log the exception (pseudo-code)
                // Log.Error("Failed to update Serial");
                throw;
            }
            return serial;
        }
        public async Task UpdateSerialDeleteExam(int id)
        {
            var serial = await _context.Serials.FindAsync(id);
            serial.ExamId = null;
            await _context.SaveChangesAsync();
        }
        private async Task<List<Serial>> GetSerialG(int chapter_ID, int Index)
        {
            var result = from serial in context.Serials
                         join lesson in context.Lessons on serial.LessonId equals lesson.Id
                         join chapter in context.Chapters on lesson.ChapterId equals chapter.Id
                         where lesson.ChapterId == chapter_ID && serial.Index > Index
                         select (new Serial
                         {
                             Id = serial.Id,
                             Index = serial.Index,
                             LessonId = serial.LessonId,
                             ExamId = serial.ExamId
                         });

            var serialList = await result.ToListAsync();
            return serialList;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var serial2 = await _context.Serials
     .Join(_context.Lessons,
         serial => serial.LessonId,
         lesson => lesson.Id,
         (serial, lesson) => new { Serial = serial, Lesson = lesson })
     .FirstOrDefaultAsync(s => s.Serial.LessonId == id);
                if (serial2 == null) return false;
                var serial = await _context.Serials.FirstAsync(s => s.Id == serial2.Serial.Id);

                _context.Serials.Remove(serial);

                // Efficiently update all higher index Serials in one go if supported
                var higherIndexSerials = await GetSerialG(serial2.Lesson.ChapterId, (int)serial.Index);
                if (higherIndexSerials != null)
                {
                    foreach (var higherSerial in higherIndexSerials)
                    {
                        higherSerial.Index--;
                    }
                    _context.UpdateRange(higherIndexSerials);
                }

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }





    //public async Task UpdateIndexHightoLow (int index, int indexhigher)
    //{
    //    var ListSerial = await _context.Serials.Where(s => s.Index > index && s.Index < indexhigher).ToListAsync();
    //    foreach (Serial serial in ListSerial)
    //    {
    //        serial.Index++;
    //    }
    //    await _context.SaveChangesAsync();
    //}
    //public async Task UpdateIndexLowtoHigh(int index, int indexhigher)
    //{
    //    var ListSerial = await _context.Serials.Where(s => s.Index > index && s.Index < indexhigher).ToListAsync();
    //    foreach (Serial serial in ListSerial)
    //    {
    //        serial.Index--;
    //    }
    //    await _context.SaveChangesAsync();
    //}
    //public async Task InsertIndex(int index)
    //{
    //    var ListSerial = await _context.Serials.Where(s => s.Index > index).ToListAsync();
    //    foreach (Serial serial in ListSerial)
    //    {
    //        serial.Index--;
    //    }
    //    await _context.SaveChangesAsync();
    //}
}

