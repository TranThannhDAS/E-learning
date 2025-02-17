using backend.Data;
using backend.Dtos;
using backend.Entities;

namespace backend.Service.Interface
{
    public interface ISerialService
    {
        //Task InsertIndex(int index);
        //Task UpdateIndexHightoLow(int index, int indexhigher);
        Task<List<Serial>> GetAllAsync();
        Task<Serial> CreateSerial(SerialDtoCreate chapter);
        Task<Serial?> UpdateSerial(SerialDtoUpdate updateSerial);
        Task<bool> DeleteAsync(int id);
        Task UpdateSerialDeleteExam(int id);
    }
}
