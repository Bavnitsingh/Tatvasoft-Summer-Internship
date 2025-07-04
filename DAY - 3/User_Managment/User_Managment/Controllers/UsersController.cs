using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using User_Management.DataAccess.Models;
using User_Management.Services.Services;
using User_Management.Services.DTOs;

namespace User_Managment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("GetAllUsers")]
        public ActionResult<List<User>> GetAllUsers()
        {
            List<User> Users = _userService.GetUsers();
            if (Users == null || Users.Count == 0)
            {
                return NotFound("No Users found");
            }
            else
            {
                return Ok(Users);
            }
        }

        [HttpGet("GetSingleUser")]
        public ActionResult<User> GetUser(int id)
        {
            User User = _userService.GetUserById(id);
            if (User == null)
            {
                return NotFound("User Not found");
            }
            else
            {
                return Ok(User);
            }
        }

        [HttpPost]
        public ActionResult AddUser(User User)
        {
            _userService.AddUser(User);
            return Ok("User added successfully");
        }

        [HttpPut]
        public ActionResult UpdateUser(User UserToBeUpdated)
        {
            int UserUpdateStatus = _userService.UpdateUser(UserToBeUpdated);
            if (UserUpdateStatus == -1)
            {
                return NotFound("User Not FOund");
            }
            else if (UserUpdateStatus == 1)
            {
                return Ok("User updated successfully");
            }
            else
            {
                return BadRequest("Bad request");
            }
        }

        [HttpDelete]
        public ActionResult DeleteUser(int id)
        {
            int deleteStatus = _userService.DeleteUser(id);
            if (deleteStatus == -1)
            {
                return NotFound("User Not found");
            }
            else if (deleteStatus == 1)
            {
                return Ok("User Deleted Successfully");
            }
            else
            {
                return BadRequest("Bad request");
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User_Management.Services.DTOs.LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
                return BadRequest("Invalid login data.");

            var user = _userService.Login(loginRequest.Username, loginRequest.Password);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            // In production, generate a JWT token here and return
            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }

        [HttpGet("GetFilteredUsers")]
        public ActionResult GetFilteredUsers(string name)
        {
            List<User> Users = _userService.GetFilteredUsers(name);
            if (Users == null || Users.Count == 0)
            {
                return NotFound("Users Not Found");
            }
            else
            {
                return Ok(Users);
            }

        }
    }
}
