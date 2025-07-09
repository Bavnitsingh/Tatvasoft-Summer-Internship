using Mission.Entities.Entities;
using Mission.Entities.Models;

namespace Mission.Services.IServices
{
    public interface IUserService
    {
        public List<User> GetAllUsers();
        Task<string> AddUserAsync(UserRequestModel model);
        Task<string> UpdateUserAsync(int userId, UserRequestModel model);
        bool DeleteUser(int userId);
    }
}
