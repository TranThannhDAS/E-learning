using backend.Service.Interface;

namespace backend.Service
{
    public class ImageServices : IimageServices
    {
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
        private static readonly string[] AllowedVideoExtensions = { ".mp4", ".avi", ".mov", ".wmv" };
        public ImageServices(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }
        private string GetRootPath()
        {
            return Path.Combine(_env.WebRootPath);
        }
        private string FilePath(string filePath)
        {
            return Path.Combine(GetRootPath(), filePath);
        }
        private string CreateGuildFileName(IFormFile file)
        {
            // Tạo một GUID mới
            string newFileName = Guid.NewGuid().ToString();

            // Lấy phần mở rộng của tệp gốc
            string fileExtension = Path.GetExtension(file.FileName);

            // Gắn GUID vào tên tệp mới với phần mở rộng gốc
            string fullFileName = newFileName + fileExtension;
            return fullFileName;
        }
        public string AddFile(IFormFile file, string rootFolder, string subFolder)
        {
            try
            {
                //string subFolder = fileType;
                string rootPath = Path.Combine(GetRootPath(), rootFolder, subFolder);
                if (!Directory.Exists(rootPath))
                {
                    Directory.CreateDirectory(rootPath);
                }

                string fullFileName = CreateGuildFileName(file);
                // Đường dẫn đầy đủ để lưu tệp
                string fullPath = Path.Combine(rootPath, fullFileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    // Sao chép nội dung của file vào stream
                    file.CopyTo(stream);
                }
                // Lấy đường dẫn tương đối từ sau 'wwwroot'
                string relativePath = fullPath.Substring(_env.WebRootPath.Length).TrimStart(Path.DirectorySeparatorChar);
                //string relativePath = Path.Combine("wwwroot", fullPath.Substring(_env.WebRootPath.Length).TrimStart(Path.DirectorySeparatorChar));
                return relativePath;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //public string UpdateFile(IFormFile file, string filename,string rootFolder, string fileType)
        //{
        //    string fileDelete = DeleteFile(filename);
        //    string filePath = "";
        //    if (fileDelete != null)
        //    {
        //        filePath = AddFile(file,fileType);
        //    }
        //    return filePath;
        //}
        public string UpdateFile(IFormFile file, string existingFilePath, string rootFolder, string subFolder)
        {
            string fullExistingPath = Path.Combine(GetRootPath(), existingFilePath);
            if (File.Exists(fullExistingPath))
            {
                File.Delete(fullExistingPath);
            }

            return AddFile(file, rootFolder, subFolder);
        }
        public string DeleteFile(string filename)
        {
            string filePath = FilePath(filename);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return filename;
            }
            return "failed";
        }
        public string GetFile(string relativePath)
        {
            string fullPath = FilePath(relativePath);
            if (File.Exists(fullPath))
            {
                var request = _httpContextAccessor.HttpContext.Request;
                string baseUrl = $"{request.Scheme}://{request.Host}";

                // Loại bỏ phần 'wwwroot' khỏi đường dẫn tập tin để tạo URL
                //string cleanedPath = fullPath.Replace(_env.WebRootPath + "\\", "").Replace('\\', '/');
                //string cleanedPath = fullPath.Replace(_env.WebRootPath + Path.DirectorySeparatorChar, "").Replace(Path.DirectorySeparatorChar, '/');
                string cleanedPath = fullPath.Substring(_env.WebRootPath.Length + 1).Replace(Path.DirectorySeparatorChar, '/');
                return $"{baseUrl}/{cleanedPath}";
            }
            else
            {
                //throw new FileNotFoundException($"File not found at the specified path.{ fullPath}");
                return "";
            }
        }
        public bool IsImage(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return AllowedImageExtensions.Contains(extension);
        }

        public bool IsVideo(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return AllowedVideoExtensions.Contains(extension);
        }
    }
}
