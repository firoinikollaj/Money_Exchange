namespace Server.Models
{
    public class AddEditUserDto
    {
        public string Email { get; set; }
        public string Password { get; set; }  // only required for add
        public string Role { get; set; }
    }

}
