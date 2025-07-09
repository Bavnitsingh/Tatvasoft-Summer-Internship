using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Mission.Entities.Context;
using Mission.Entities.Entities;
using Mission.Entities.Models;
using Mission.Repositories.IRepositories;

namespace Mission.Repositories.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MissionDbContext _dbContext;

        public UserRepository(MissionDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<User> GetAllUsers()
        {
            List<User> users = _dbContext.Users.Where(user => !user.IsDeleted && user.UserType == "user").ToList();
            return users;
        }

        public async Task<string> AddUserAsync(UserRequestModel model)
        {
            bool userExists = _dbContext.Users.Any(user => user.EmailAddress.ToLower() == model.EmailAddress.ToLower() && !user.IsDeleted);

            if (userExists) throw new Exception("Email Address already exists.");

            string webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            //save Image
            string imagePath = await SaveImageAsync(model.ProfileImage, "Images", webRootPath);

            User user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
                EmailAddress = model.EmailAddress,
                Password = model.Password,
                UserType = model.UserType,
                UserImage = imagePath,
                CreatedDate = DateTime.UtcNow,
            };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return "User added successfully.";
        }

        public async Task<string> UpdateUserAsync(int userId, UserRequestModel model)
        {
            User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

            if (user == null) throw new Exception("User not found.");
            if (model.ProfileImage != null && model.ProfileImage.Length > 0)
            {
                string webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                string imagePath = await SaveImageAsync(model.ProfileImage, "Images", webRootPath);
                user.UserImage = imagePath;
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.EmailAddress = model.EmailAddress;
            user.PhoneNumber = model.PhoneNumber;
            user.Password = model.Password;
            user.UserType = model.UserType;
            user.ModifiedDate = DateTime.UtcNow;

            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            return "User updated successfully.";
        }

        public bool DeleteUser(int userId)
        {
            User? user = _dbContext.Users.FirstOrDefault(user => user.Id == userId && !user.IsDeleted);
            if (user == null) return false;

            user.IsDeleted = true;
            _dbContext.SaveChanges();
            return true;
        }

        private static async Task<string> SaveImageAsync(IFormFile file, string folderName, string webRootPath)
        {
            if (file == null || file.Length == 0) return null;

            //wwwroot/Images
            string uploadFolder = Path.Combine(webRootPath, folderName);

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }
            //.jpg .png
            string fileExtension = Path.GetExtension(file.FileName);
            string fileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            string fullPath = Path.Combine(uploadFolder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // "Imgaes/Profile_3452364.jpg"
            return Path.Combine(folderName, fileName).Replace("\\", "/");
        }
    }
}
