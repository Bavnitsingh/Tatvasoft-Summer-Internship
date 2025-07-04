using Microsoft.EntityFrameworkCore;
using User_Management.DataAccess.Models;

namespace User_Management.DataAccess
{
    public class UserManagementDbContext : DbContext
    {
        public UserManagementDbContext(DbContextOptions<UserManagementDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }

    }
}
