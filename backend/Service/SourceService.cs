using backend.Base;
using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Text;
using AutoMapper;
using Nest;

namespace backend.Service
{
    public class SourceService(ICartService cartService,LMSContext context, IMapper mapper, IimageServices imageServices, IExamService examService, IElasticSearchRepository elasticsearchRepository, IChapterService chapterService) : ISourceService
    {
        private readonly LMSContext _context = context;
        private readonly ICartService _cartService = cartService;
        private readonly IMapper _mapper = mapper;
        private readonly IimageServices _imageServices = imageServices;
        private readonly IExamService _examService = examService;
        private readonly IElasticSearchRepository _elasticsearchRepository = elasticsearchRepository;
        private readonly IChapterService _chapterService = chapterService;

        public async Task<Source> CreateAsync(SourceDto sourceDto)
        {
            var source = _mapper.Map<Source>(sourceDto);
            // Kiểm tra và xử lý tải lên thumbnail
            if (sourceDto.Thumbnail != null)
            {
                if (!_imageServices.IsImage(sourceDto.Thumbnail))
                {
                    throw new Exception("Invalid image format. Only JPG, JPEG, PNG, and GIF are allowed.");
                }
                string thumbnailPath = _imageServices.AddFile(sourceDto.Thumbnail, "sources", "thumbnails");
                source.Thumbnail = thumbnailPath;
            }
            // Kiểm tra và xử lý tải lên video giới thiệu
            if (sourceDto.VideoIntro != null)
            {
                if (!_imageServices.IsVideo(sourceDto.VideoIntro))
                {
                    throw new Exception("Invalid video format. Only MP4, AVI, MOV, and WMV are allowed.");
                }
                string videoPath = _imageServices.AddFile(sourceDto.VideoIntro, "sources", "videos");
                source.VideoIntro = videoPath;
            }

            _context.Sources.Add(source);
            try
            {
                int check = await _context.SaveChangesAsync();
                if (check <= 0)
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            var result = await GetWithToppicIdAsync(source.Id);

            var onlySource = new OnlySources
            {
                Id = result.Id,
                Title = new CompletionField { Input = new List<string> { result.Title } },
                Description = result.Description,
                Thumbnail = result.Thumbnail,
                Slug = result.Slug,
                Status = source.Status ? 1 : 0,
                Benefit = "",
                Video_intro = result.VideoIntro,
                Price = result.Price,
                Rating = int.Parse(result.Rating),
                UserId = (int)result.UserId,
                TopicId = (int)result.SubTopicId,
                TopicName = result.TopicName,
                SubTopicId = (int)result.SubTopicId,
                SubTopicName = result.SubTopicName
            };
            var createSource = _elasticsearchRepository.AddorUpdateDataSources<OnlySources>(onlySource, source.Id.ToString());

            return source;
        }

        public async Task<List<SourceWithTopicId>> GetAllAsync()
        {
            var sources = await _context.Sources
                 //.Include(s => s.User)
                 .Include(s => s.SubTopic)
                 .Select(s => new SourceWithTopicId
                 {
                     Source = _mapper.Map<SourceViewDto>(s),
                     //Source =s,
                     TopicId = s.SubTopic.TopicId ?? null,
                     TopicName = s.SubTopic.Topic.TopicName ?? null,

                 })
                 .ToListAsync();
            if (sources.Any())
                foreach (var source in sources)
                {
                    if (source.Source != null)
                    {
                        //if (source.Source.Thumbnail != null)
                        source.Source.Thumbnail = source.Source.Thumbnail != null ? _imageServices.GetFile(source.Source.Thumbnail) : null;
                        //if (source.Source.VideoIntro != null)
                        source.Source.VideoIntro = source.Source.VideoIntro != null ? _imageServices.GetFile(source.Source.VideoIntro) : null;
                    }
                }
            return sources;
        }

        public async Task<(List<SourceWithTopicId>, int)> GetAllAsync(Pagination pagination)
        {
            var sources = await _context.Sources
                 //.Include(s => s.User)
                 .Include(s => s.SubTopic)
                 .Select(s => new SourceWithTopicId
                 {
                     Source = _mapper.Map<SourceViewDto>(s),
                     //Source = s,
                     TopicId = s.SubTopic != null ? s.SubTopic.TopicId : null,
                     TopicName = s.SubTopic.Topic != null ? s.SubTopic.Topic.TopicName : null
                 })
                //.Include(s => s.Chapters)
                .Skip((pagination.PageIndex - 1) * pagination.PageSize)
                 .Take(pagination.PageSize)
                .ToListAsync();
            if (sources.Any())
                foreach (var source in sources)
                {
                    if (source.Source != null)
                    {
                        if (source.Source.Thumbnail != null)
                            source.Source.Thumbnail = _imageServices.GetFile(source.Source.Thumbnail);
                        if (source.Source.VideoIntro != null)
                            source.Source.VideoIntro = _imageServices.GetFile(source.Source.VideoIntro);
                    }
                }
            //var sourceview = _mapper.Map<List<SourceViewDto>>(sources);
            var count = await _context.Sources.CountAsync();
            return (sources, count);
        }

        public async Task<SourceViewDto?> GetByIdAsync(int id)
        {
            var source = await _context.Sources
                //.Include(s => s.User)
                //.Include(s => s.SubTopic)
                //.Select(s => new SourceWithTopicId
                //{
                //    Source = _mapper.Map<SourceViewDto>(s),
                //    TopicId = s.SubTopic.TopicId
                //})
                //.Include(s => s.Chapters)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (source != null)
            {
                if (source.Thumbnail != null)
                    source.Thumbnail = _imageServices.GetFile(source.Thumbnail);
                if (source.VideoIntro != null)
                    source.VideoIntro = _imageServices.GetFile(source.VideoIntro);

                SourceViewDto sourceViewDto = _mapper.Map<SourceViewDto>(source);

                var subtopic = await _context.SubTopics.FirstOrDefaultAsync(s => s.Id == source.SubTopicId);
                sourceViewDto.TopicId = subtopic.TopicId;
                return sourceViewDto;
            }
            return null;
        }

        private async Task<SourceViewDto?> GetWithToppicIdAsync(int id)
        {
            var source = await _context.Sources
                .FirstOrDefaultAsync(s => s.Id == id);
            if (source != null)
            {
                //if (source.Thumbnail != null)
                //    source.Thumbnail = _imageServices.GetFile(source.Thumbnail);
                //if (source.VideoIntro != null)
                //    source.VideoIntro = _imageServices.GetFile(source.VideoIntro);

                SourceViewDto sourceViewDto = _mapper.Map<SourceViewDto>(source);
                var subtopic = await _context.SubTopics.Include(p => p.Topic).FirstOrDefaultAsync(s => s.Id == source.SubTopicId);
                sourceViewDto.TopicId = subtopic.TopicId;
                sourceViewDto.TopicName = subtopic.Topic.TopicName;
                sourceViewDto.SubTopicName = subtopic.SubTopicName;
                return sourceViewDto;
            }
            return null;
        }
        public async Task<Source?> UpdateAsync(int id, SourceDto updatedSource)
        {
            var source = await _context.Sources.FindAsync(id);
            if (source == null) return null;

            // Cập nhật thông tin từ updatedSource vào source
            source.Title = updatedSource.Title;
            source.Description = updatedSource.Description;
            source.Slug = GenerateSlug(updatedSource.Title);
            source.Status = (bool)updatedSource.Status;
            source.Benefit = updatedSource.Benefit;
            source.Requirement = updatedSource.Requirement;
            source.Price = (double)updatedSource.Price;
            source.Rating = updatedSource.Rating;
            source.UserId = updatedSource.UserId;
            source.SubTopicId = updatedSource.SubTopicId;
            //source.StaticFolder = updatedSource.StaticFolder;

            // Update thumbnail file if a new file is provided
            if (updatedSource.Thumbnail != null && !string.IsNullOrWhiteSpace(updatedSource.Thumbnail.FileName))
            {
                if (!string.IsNullOrWhiteSpace(source.Thumbnail))
                {
                    // Assuming Thumbnail stores a relative path under wwwroot
                    string existingThumbnailPath = source.Thumbnail;
                    source.Thumbnail = _imageServices.UpdateFile(updatedSource.Thumbnail, existingThumbnailPath, "sources", "thumbnails");
                }
                else
                {
                    source.Thumbnail = _imageServices.AddFile(updatedSource.Thumbnail, "sources", "thumbnails");
                }
            }
            else if (source.Thumbnail != null && updatedSource.Thumbnail == null)
            {
                //_imageServices.DeleteFile(source.Thumbnail);
                //source.Thumbnail = null;
            }
            else
            {
                source.Thumbnail = null;
            }

            // Update video file if a new file is provided
            if (updatedSource.VideoIntro != null && !string.IsNullOrWhiteSpace(updatedSource.VideoIntro.FileName))
            {
                if (!string.IsNullOrWhiteSpace(source.VideoIntro))
                {
                    // Assuming VideoIntro stores a relative path under wwwroot
                    string existingVideoPath = source.VideoIntro;
                    source.VideoIntro = _imageServices.UpdateFile(updatedSource.VideoIntro, existingVideoPath, "sources", "videos");
                }
                else
                {
                    source.VideoIntro = _imageServices.AddFile(updatedSource.VideoIntro, "sources", "videos");
                }
            }
            else if (source.VideoIntro != null && updatedSource.VideoIntro == null)
            {
                //_imageServices.DeleteFile(source.VideoIntro);
                //source.VideoIntro = null;
            }
            else
            {
                source.VideoIntro = null;
            }
            // Lưu các thay đổi vào cơ sở dữ liệu
            int check = await _context.SaveChangesAsync();
            if (check > 0)
            {
                // Lấy thông tin về Source đã được cập nhật từ cơ sở dữ liệu
                var result = await GetWithToppicIdAsync(source.Id);
                var OnlySource = @"
  ctx._source.Title = params.Title;
  ctx._source.Description = params.Description;
  ctx._source.Thumbnail = params.Thumbnail;
  ctx._source.Slug = params.Slug;
  ctx._source.Status = params.Status;
  ctx._source.Benefit = params.Benefit;
  ctx._source.Video_intro = params.Video_intro;
  ctx._source.Price = params.Price;
  ctx._source.Rating = params.Rating;
  ctx._source.UserId = params.UserId;
  ctx._source.TopicId = params.TopicId;
  ctx._source.TopicName = params.TopicName;
  ctx._source.SubTopicId = params.SubTopicId;
  ctx._source.SubTopicName = params.SubTopicName;
";

                var params1 = new Dictionary<string, object>
{
    { "Title", new CompletionField { Input = new List<string> { result.Title } } },
    { "Description", result.Description },
    { "Thumbnail", result.Thumbnail },
    { "Slug", result.Slug },
    { "Status", result.Status },
    { "Benefit", " " },
    { "Video_intro", result.VideoIntro },
    { "Price", result.Price },
    { "Rating", result.Rating },
    { "UserId", result.UserId },
    { "TopicId", result.TopicId },
    { "TopicName", result.TopicName },
    { "SubTopicId", result.SubTopicId },
    { "SubTopicName", result.SubTopicName }
};

                var updateResponse = _elasticsearchRepository.UpdateScript(id.ToString(), u => u
                    .Index("only_sources_v3")
                    .Script(s => s
                        .Source(OnlySource)
                        .Params(params1)
                    )
                );
            }

            return source;
        }
        public async Task<bool> DeleteAsync(int id)
        {

            var source = await _context.Sources.FindAsync(id);

            if (source == null) return false;
            // xóa exam theo source
            var list_exam = await _context.Exams.Where(l => l.SourceId == id).ToListAsync();
            if (list_exam != null)
            {
                foreach (var exam in list_exam)
                {
                    await _examService.DeleteAsync(exam.Id);
                }
                //_context.Exams.RemoveRange(list_exam);
            }
            // xóa exam theo chapter
            var list_chapter = await _context.Chapters.Where(l => l.SourceId == id).ToListAsync();
            if (list_chapter != null)
            {
                foreach(var chapter in list_chapter)
                {
                    await _chapterService.DeleteAsync(chapter.Id);
                }
                //_context.Chapters.RemoveRange(list_chapter);
            }
            var list_favorite = await _context.FavoriteSources.Where(f => f.SourceId == id).ToListAsync();
            if (list_favorite != null)
            {
                _context.FavoriteSources.RemoveRange(list_favorite);
            }
            if (!string.IsNullOrEmpty(source.Thumbnail))
            {
                _imageServices.DeleteFile(source.Thumbnail);  // Delete thumbnail file
            }
            if (!string.IsNullOrEmpty(source.VideoIntro))
            {
                _imageServices.DeleteFile(source.VideoIntro);  // Delete video intro file
            }
            _context.Sources.Remove(source);
            int check = await _context.SaveChangesAsync();
            if (check > 0)
            {
                bool check2 = _elasticsearchRepository.RemoveDocument(id.ToString());
                return check2;
            }
            else
            {
                return false;
            }

        }

        private static string GenerateSlug(string title)
        {
            string normalizedString = title.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new();

            foreach (var c in normalizedString)
            {
                UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            string cleanStr = stringBuilder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
            string slug = Regex.Replace(cleanStr, @"\s+", "-"); // Replace spaces with hyphens
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", ""); // Remove all non-alphanumeric characters except hyphens

            return slug;
        }

        public async Task<object> GroupByTopic()
        {
            var source = await GetAllAsync();
            var result = source.GroupBy(x => new { x.TopicId, x.TopicName }).Select(x => new
            {
                TopicID = x.Key.TopicId,
                TopicName = x.Key.TopicName,
                source = x.Select(s => new
                {
                    s.Source.Id,
                    s.Source.Title,
                    s.Source.Description,
                    s.Source.Thumbnail,
                    s.Source.Slug,
                    s.Source.Status,
                    s.Source.Benefit,
                    s.Source.VideoIntro,
                    s.Source.Price,
                    s.Source.Rating,
                    s.Source.UserId
                }).ToList()
            }).ToList();
            return result;
        }
        public async Task<bool> SourceCheckOrder(int userId, int sourceId)
        {
            var source = await _context.Orders
                //.Where(o => o.UserID == userId && o.SouresID == sourceId)
                .FirstOrDefaultAsync(o => o.UserID == userId && o.SouresID == sourceId);
            if (source == null)
            {
                return false;
            }
            return true;
        }
    }

}
