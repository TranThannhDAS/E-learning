using backend.Dtos.UserDto;
using backend.Entities;
using Microsoft.AspNetCore.Mvc;

namespace backend.Service.Interface
{
    public interface IUserService
    {
        Task<ListUserDto?> GetById(int id);
        Task<ListUserDto?> GetByUsername(string username);
        Task<User?> GetByEmail(string email);

        Task<User?> Create(UserRegisterDto registerViewModel);
        Task<Tuple<Tokens, User>> Login(UserLoginDto loginViewModel);
        Task<Tokens> Refresh(Tokens tokens);
        //Task<bool> IsUserExists(string username);
        Task AddRequest(ForgotPasswordRequest request);
        Task<ForgotPasswordRequest> GetByUserNameAndCode(string username, string code);
        Task DeleteExpiredRequests();
        void SendConfirmationEmail(string email, string confirmationCode);
        string? GenerateRandomCode();
        Task RemoveConfirmCode(ForgotPasswordRequest confirmCode);
        Task ChangePassword(ChangePassworkDto user);
        Task ResetPassword(ResetPasswordDto user);
        Task Logout(Tokens tokens);
        Task<List<ListUserDto>> GetListUsers();
        Task<bool> DeleteUser(int userId);
        Task<User?> CreateAdminAccount(UserRegisterDto registerViewModel);
        Task<User> UpdateUser(int userId, UserUpdateDto registerViewModel);
    }
}
