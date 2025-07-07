using Mission.Entities.Entities;

namespace Mission.Repositories.IRepositories
{
    public interface ILoginRepository
    {
        public User GetUserByEmail(string email);
    }
}
