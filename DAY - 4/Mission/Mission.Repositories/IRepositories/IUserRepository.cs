using Mission.Entities.Entities;

namespace Mission.Repositories.IRepositories
{
    public interface IUserRepository
    {
        List<User> GetAllUsers();
    }
}
