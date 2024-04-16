namespace People_Directory.Models
{
    public class Admin
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
