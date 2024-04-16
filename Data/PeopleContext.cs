using Microsoft.EntityFrameworkCore;
using People_Directory.Models;

namespace People_Directory.Data
{
    public class PeopleContext : DbContext
    {
        public PeopleContext(DbContextOptions<PeopleContext> contextOctions) : base(contextOctions)
        {

        }
        //DB Entities

        public DbSet<Person> People { get; set; }
        public DbSet<Admin> Admins { get; set; }
    }
}
