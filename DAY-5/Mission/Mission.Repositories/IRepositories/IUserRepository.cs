using Mission.Entities.Entities;
using Mission.Entities.Models;

namespace Mission.Repositories.IRepositories
{
    public interface IUserRepository
    {
        List<User> GetAllUsers();
        Task<string> AddUserAsync(UserRequestModel model);
        Task<string> UpdateUserAsync(int userId, UserRequestModel model);
        bool DeleteUser(int userId);
    }
}
