using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Mission.Entities.Entities
{
    [Table("User")]
    public class User : BaseEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; } = null!;

        [Column("last_name")]
        public string LastName { get; set; } = null!;

        [Column("email_address")]
        public string EmailAddress { get; set; } = null!;

        [Column("password")]
        public string Password { get; set; } = null!;

        [Column("phone_number")]
        public string? PhoneNumber { get; set; }

        [Column("user_type")]
        public string UserType { get; set; } = null!;

        [Column("user_image")]
        public string? UserImage { get; set; }
    }
}
