using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using User_Management.DataAccess.Models;
using User_Management.DataAccess.Repositories;

namespace User_Management.Services.Services
{
    public class UserService
    {
        private readonly UserRepository _usersRepository;

        public UserService(UserRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        public List<User> GetUsers()
        {
            try
            {
                return _usersRepository.GetUser();
            }
            catch (Exception ex)
            {
                // Log the exception here if needed
                throw new ApplicationException("Error retrieving users.", ex);
            }
        }

        public User GetUserById(int id)
        {
            try
            {
                return _usersRepository.GetUserById(id);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error retrieving user with ID {id}.", ex);
            }
        }

        public void AddUser(User user)
        {
            try
            {
                _usersRepository.AddUser(user);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error adding new user.", ex);
            }
        }

        public int UpdateUser(User user)
        {
            try
            {
                // logic 
                return _usersRepository.UpdateUser(user);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error updating user with ID {user?.Id}.", ex);
            }
        }

        public int DeleteUser(int id)
        {
            try
            {
                return _usersRepository.DeleteUser(id);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error deleting user with ID {id}.", ex);
            }
        }

        public List<User> GetFilteredUsers(string name)
        {
            try
            {
                return _usersRepository.GetFilteredUser(name);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error filtering users by name: {name}.", ex);
            }
        }

        public User? Login(string username, string password)
        {
            try
            {
                return _usersRepository.Login(username, password);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Login failed.", ex);
            }
        }

    }

}
