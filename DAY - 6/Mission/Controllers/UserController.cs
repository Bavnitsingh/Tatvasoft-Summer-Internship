using Microsoft.AspNetCore.Mvc;
using Mission.Entities;
using Mission.Entities.Models;
using Mission.Services.IServices;

namespace Mission.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpPost]
        [Route("AddUser")]        // [Authorize(Roles = "Admin")] // Uncomment if using role-based auth
        public async Task<IActionResult> AddUser([FromBody] RegisterUserRequestModel model)
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

        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromForm] UpdateUserRequestModel model)
        {
            try
            {
                var result = await _userService.UpdateUser(model);
                return Ok(new ResponseResult
                {
                    Data = result,
                    Result = ResponseStatus.Success,
                    Message = "User updated successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseResult
                {
                    Data = null,
                    Result = ResponseStatus.Error,
                    Message = $"Failed to update user: {ex.Message}"
                });
            }
        }

        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser([FromQuery] int id)
        {
            try
            {
                var res = await _userService.DeleteUser(id);
                return Ok(new ResponseResult
                {
                    Data = "User deleted successfully.",
                    Result = ResponseStatus.Success,
                    Message = ""
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseResult
                {
                    Data = null,
                    Result = ResponseStatus.Error,
                    Message = $"Failed to delete user: {ex.Message}"
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserById([FromQuery] int id)
        {
            try
            {
                var res = await _userService.GetUserById(id);
                return Ok(new ResponseResult
                {
                    Data = res,
                    Result = ResponseStatus.Success,
                    Message = "User fetched successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseResult
                {
                    Data = null,
                    Result = ResponseStatus.Error,
                    Message = $"Failed to find user: {ex.Message}"
                });
            }
        }

        [HttpGet("UserDetailList")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var res = await _userService.GetAllUsers();
                return Ok(new ResponseResult
                {
                    Data = res,
                    Result = ResponseStatus.Success,
                    Message = "User list fetched successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseResult
                {
                    Data = null,
                    Result = ResponseStatus.Error,
                    Message = $"Failed to fetch user list: {ex.Message}"
                });
            }
        }
    }
}
