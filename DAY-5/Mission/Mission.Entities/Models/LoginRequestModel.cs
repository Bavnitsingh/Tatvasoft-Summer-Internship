using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mission.Entities.Models
{
    public class LoginRequestModel
    {
        public string EmailAddress { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
