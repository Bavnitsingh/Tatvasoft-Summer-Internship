using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mission.Entities.Models;
using Mission.Services.IServices;

namespace Mission.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("GetAllUsers")]
        public ResponseResult GetAllUsers()
        {
            var result = new ResponseResult();

            try
            {
                result.Success = true;
                result.Data = _userService.GetAllUsers();
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
            }

            return result;
        }

        [HttpPost("AddUser")]
        public async Task<ResponseResult> AddUser([FromForm] UserRequestModel model)
        {
            var result = new ResponseResult();

            try
            {
                // Optional: Validate or handle null image in the service layer
                string message = await _userService.AddUserAsync(model);
                result.Success = true;
                result.Message = message;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
            }

            return result;
        }

        [HttpPost("UpdateUser/{userId}")]
        public async Task<ResponseResult> UpdateUser(int userId, [FromForm] UserRequestModel model)
        {
            var result = new ResponseResult();

            try
            {
                string message = await _userService.UpdateUserAsync(userId, model);
                result.Success = true;
                result.Message = message;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
            }

            return result;
        }

        [HttpDelete("DeleteUser/{userId}")]
        public ResponseResult DeleteUser(int userId)
        {
            var result = new ResponseResult();

            try
            {
                bool isDeleted = _userService.DeleteUser(userId);
                result.Success = isDeleted;
                result.Message = isDeleted ? "User deleted successfully." : "User not found or already deleted.";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
            }

            return result;
        }
    }
}
