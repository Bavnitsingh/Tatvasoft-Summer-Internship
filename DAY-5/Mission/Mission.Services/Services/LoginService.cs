using Mission.Entities.Entities;
using Mission.Entities.Models;
using Mission.Repositories.IRepositories;
using Mission.Services.Helpers;
using Mission.Services.IServices;

namespace Mission.Services.Services
{
    public class LoginService : ILoginService
    {
        private readonly ILoginRepository _loginRepository;
        private readonly JwtHelper _jwtHelper;
        public LoginService(ILoginRepository loginRepository, JwtHelper jwtHelper)
        {
            _loginRepository = loginRepository;
            _jwtHelper = jwtHelper;
        }

        public ResponseResult Login(LoginRequestModel model)
        {
            ResponseResult result = new();

            User user = _loginRepository.GetUserByEmail(model.EmailAddress);

            if (user == null)
            {
                result.Success = false;
                result.Message = "User not found.";
                return result;
            }

            if (user.Password != model.Password)
            {
                result.Success = false;
                result.Message = "Invalid Password.";
                return result;
            }

            //Token Generate
            string token = _jwtHelper.GetJwtToken(user);

            result.Success = true;
            result.Message = "Login Successful!";
            result.Data = token;
            return result;
        }
    }
}
