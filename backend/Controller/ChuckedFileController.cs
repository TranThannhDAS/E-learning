using Microsoft.AspNetCore.Mvc;
using Nest;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChuckedFileController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        public int chunkSize;
        private IConfiguration configuration;
        public ChuckedFileController(IWebHostEnvironment env, IConfiguration configuration)
        {
            _env = env;
            chunkSize = 1048576 * Convert.ToInt32(configuration["ChunkSize"]);
            this.configuration = configuration;
        }
        [HttpPost]
        public async Task<IActionResult> UploadChukedFile(string id, string fileName)
        {
            var chunkNumber = id;
            var path = Path.Combine(_env.WebRootPath, "Temp", fileName + chunkNumber);
            using (FileStream fs = System.IO.File.Create(path))
            {
                byte[] bytes = new byte[chunkSize];
                int bytesRead = 0;
                while ((bytesRead = await Request.Body.ReadAsync(bytes, 0, bytes.Length)) > 0)
                {
                    fs.Write(bytes, 0, bytesRead);
                }
            }
            return Ok(new
            {
                Success = true
            });
        }
        [HttpPost("UploadComplete")]
        public IActionResult UploadComplete(string fileName)
        {

            string tempPath = Path.Combine(_env.WebRootPath, "Temp");
            string newPath = Path.Combine(tempPath, fileName);
            string[] filePaths = Directory.GetFiles(tempPath).Where(p => p.Contains(fileName)).OrderBy(p => Int32.Parse(p.Replace(fileName, "$").Split('$')[1])).ToArray();
            foreach (string filePath in filePaths)
            {
                MergeChunks(newPath, filePath);
            }
            System.IO.File.Move(Path.Combine(tempPath, fileName), Path.Combine(_env.WebRootPath, fileName));

            return Ok(new
            {
                Success = true
            });
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
    }
}
