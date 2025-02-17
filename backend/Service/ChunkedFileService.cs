using Azure.Core;
using backend.Service.Interface;
using System.Reflection.Metadata;

namespace backend.Service
{
    public class ChunkedFileService
    {
        private readonly IWebHostEnvironment _env;
        public int chunkSize;
        private IConfiguration configuration;

        public ChunkedFileService(IWebHostEnvironment env, IConfiguration _configuration)
        {
            _env = env;
            chunkSize = 1048576 * Convert.ToInt32(configuration["ChunkSize"]);
            configuration = _configuration;
        }

        /* public async Task<bool> UploadChunks(string id, string fileName, Blob chunk)
         {
             var chunkNumber = id;
             var path = Path.Combine(_env.WebRootPath, "Temp", fileName, chunkNumber);
             using (FileStream fs = System.IO.File.Create(path))
             {
                 byte[] bytes = new byte[chunkSize];
                 int bytesRead = 0;
                 while ((bytesRead = await chunk.ReadAsync(bytes, 0, bytes.Length)) > 0)
                 {
                     fs.Write(bytes, 0, bytesRead);
                 }
             }
             return true;
         }*/

        public Task<bool> UploadComplete(string fileName)
        {
            throw new NotImplementedException();
        }
    }
}
