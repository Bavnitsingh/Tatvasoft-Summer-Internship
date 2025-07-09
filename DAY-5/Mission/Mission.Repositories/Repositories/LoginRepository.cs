using Mission.Entities.Context;
using Mission.Entities.Entities;
using Mission.Repositories.IRepositories;

namespace Mission.Repositories.Repositories
{
    public class LoginRepository : ILoginRepository
    {
        private readonly MissionDbContext _dbContext;
        public LoginRepository(MissionDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public User GetUserByEmail(string email)
        {
            User? user = _dbContext.Users.FirstOrDefault(user => user.EmailAddress == email);
            return user;
        }
    }
}
