using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Mission.Entities.Context;

namespace Mission.Entities
{
    public class MissionDbContextFactory : IDesignTimeDbContextFactory<MissionDbContext>
    {
        public MissionDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MissionDbContext>();
            optionsBuilder.UseNpgsql("host=localhost;port=5432;Database=Mission;Username=postgres;Password=A1B2");

            return new MissionDbContext(optionsBuilder.Options);
        }
    }
}
