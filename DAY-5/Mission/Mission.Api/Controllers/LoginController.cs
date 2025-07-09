using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission.Entities.Models;
using Mission.Services.IServices;

namespace Mission.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("LoginUser")]
        public IActionResult Login(LoginRequestModel model)
        {
            ResponseResult result = _loginService.Login(model);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
