using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using User_Management.DataAccess.Models;

namespace User_Management.DataAccess.Repositories
{
    public class UserRepository
    {
        private readonly UserManagementDbContext _userDbContext;

        public UserRepository(UserManagementDbContext UserDbContext)
        {
            _userDbContext = UserDbContext;
        }

        // get all user from db 
        public List<User> GetUser()
        {
            return _userDbContext.Users.ToList();
        }

        public User GetUserById(int id)
        {
            User User = _userDbContext.Users.FirstOrDefault(User => User.Id == id);
            if (User == null)
            {
                return null;
            }
            return User;
        }

        public void AddUser(User User)
        {
            _userDbContext.Users.Add(User);
            _userDbContext.SaveChanges();
        }

        public int UpdateUser(User User)
        {
            User UserToBeUpdated = GetUserById(User.Id);
            if (UserToBeUpdated == null)
            {
                return -1;
            }
            else
            {
                UserToBeUpdated.Username = User.Username;
                UserToBeUpdated.Password = User.Password;
                UserToBeUpdated.Email = User.Email;
                _userDbContext.SaveChanges();
                return 1;
            }
        }

        public int DeleteUser(int id)
        {
            User UserToBeRemoved = GetUserById(id);
            if (UserToBeRemoved == null)
            {
                return -1;
            }
            else
            {
                _userDbContext.Users.Remove(UserToBeRemoved);
                _userDbContext.SaveChanges();
                return 1;
            }
        }

        public List<User> GetFilteredUser(string name)
        {
            List<User> User = _userDbContext.Users.Where(User => User.Username.Equals(name)).ToList();
            return User;
        }

        public User? Login(string username, string password)
        {
            return _userDbContext.Users
                .FirstOrDefault(u => u.Username == username && u.Password == password);
        }

    }
}
