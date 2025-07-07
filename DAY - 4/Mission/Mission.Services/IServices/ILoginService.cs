using Mission.Entities.Models;

namespace Mission.Services.IServices
{
    public interface ILoginService
    {
        public ResponseResult Login(LoginRequestModel model);
    }
}
