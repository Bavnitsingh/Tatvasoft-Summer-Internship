using Mission.Entities.Entities;
using Mission.Entities.Models;
using Mission.Repositories.IRepositories;
using Mission.Services.IServices;

namespace Mission.Services.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public List<User> GetAllUsers()
        {
            return _userRepository.GetAllUsers();
        }

        public async Task<string> AddUserAsync(UserRequestModel model)
        {
            return await _userRepository.AddUserAsync(model);
        }

        public async Task<string> UpdateUserAsync(int userId, UserRequestModel model)
        {
            return await _userRepository.UpdateUserAsync(userId, model);
        }

        public bool DeleteUser(int userId)
        {
            return _userRepository.DeleteUser(userId);
        }
    }
}
