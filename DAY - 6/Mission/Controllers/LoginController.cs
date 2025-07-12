using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mission.Entities;
using Mission.Entities.Models;
using Mission.Services.IServices;
using Mission.Services.Services;

namespace Mission.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IUserService _userService;

        public LoginController(ILoginService loginService, IWebHostEnvironment hostingEnvironment, IUserService userService)
        {
            _loginService = loginService;
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
        }

        [HttpPost]
        [Route("LoginUser")]
        public ResponseResult LoginUser(LoginUserRequestModel model)
        {
            var result = new ResponseResult
            {
                Data = null!,
                Result = ResponseStatus.Error,
                Message = string.Empty
            };

            try
            {
                result.Data = _loginService.LoginUser(model);
                result.Result = ResponseStatus.Success;
                result.Message = "Login successful.";
            }
            catch (Exception ex)
            {
                result.Result = ResponseStatus.Error;
                result.Message = $"Login failed: {ex.Message}";
            }

            return result;
        }

        [HttpPost]
        [Route("AddUser")]
        public async Task<IActionResult> AddUser([FromForm] RegisterUserRequestModel model)
        {
            try
            {
                var result = await _userService.AddUser(model);
                return Ok(new ResponseResult
                {
                    Data = result,
                    Result = ResponseStatus.Success,
                    Message = "User added successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseResult
                {
                    Data = null,
                    Result = ResponseStatus.Error,
                    Message = $"Failed to add user: {ex.Message}"
                });
            }
        }
        [HttpPost]
        [Route("Register")]
        public async Task<ActionResult> RegisterUser([FromForm] RegisterUserRequestModel registerUserRequest)
        {
            try
            {
                var res = await _loginService.RegisterUser(registerUserRequest);
                return Ok(new ResponseResult
                {
                    Data = res,
                    Result = ResponseStatus.Success,
                    Message = "User registered."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseResult
                {
                    Data = null!,
                    Result = ResponseStatus.Error,
                    Message = $"Failed to add user: {ex.Message}"
                });
            }
        }

        [HttpGet]
        [Route("LoginUserDetailById/{id}")]
        public ResponseResult LoginUserDetailById(int id)
        {
            var result = new ResponseResult
            {
                Data = null!,
                Result = ResponseStatus.Error,
                Message = string.Empty
            };

            try
            {
                result.Data = _loginService.LoginUserDetailById(id);
                result.Result = ResponseStatus.Success;
                result.Message = "User details fetched.";
            }
            catch (Exception ex)
            {
                result.Result = ResponseStatus.Error;
                result.Message = $"Error fetching user details: {ex.Message}";
            }

            return result;
        }
    }
}
