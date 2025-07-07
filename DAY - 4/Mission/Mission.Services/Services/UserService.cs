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

        public ResponseResult GetAllUsers()
        {
            ResponseResult result = new();
            List<User> users = _userRepository.GetAllUsers();

            if (users == null)
            {
                result.Success = false;
                result.Message = "Users not found.";
                return result;
            }

            result.Success = true;
            result.Data = users;
            return result;
        }
    }
}
