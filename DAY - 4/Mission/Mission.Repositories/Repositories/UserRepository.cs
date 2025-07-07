using Mission.Entities.Context;
using Mission.Entities.Entities;
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
            return _dbContext.Users.ToList();
        }
    }
}
