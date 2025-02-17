using Microsoft.AspNetCore.Mvc;

namespace backend.Service.Interface
{
    public interface IChukedFileService
    {
        Task<bool> UploadChunks(string id, string fileName);
        Task<bool> UploadComplete(string fileName);
    }
}
