using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Mission.Entities.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Mission.Services.Helpers
{
    public class JwtHelper(IConfiguration config)
    {
        private IConfiguration _config = config;

        public string GetJwtToken(User user)
        {
            SymmetricSecurityKey? securityKey = new(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            SigningCredentials? creds = new(securityKey, SecurityAlgorithms.HmacSha256);

            Claim[]? claims =
            [
               new Claim("userId",user.Id.ToString()),
                new Claim("fullName",user.FirstName+" "+user.LastName),
                new Claim("firstName",user.FirstName),
                new Claim("lastName",user.LastName),
                new Claim("emailAddress",user.EmailAddress),
                new Claim(ClaimTypes.Role, user.UserType.ToLower()),
                new Claim("userImage",user.UserImage)
            ];

            JwtSecurityToken? token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
