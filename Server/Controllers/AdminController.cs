using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Entities;
using Server.Models;

namespace Server.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AdminController : ControllerBase
    {
        private readonly CurrencyExchangeDbContext _context;

        public AdminController(CurrencyExchangeDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        
        public IActionResult Users()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int loggedInUserId))
            {
                return Unauthorized("Invalid user ID in token.");
            }

            var users = _context.Users
         .Where(u => u.Id != loggedInUserId)
         .Select(u => new
         {
             u.Id,
             u.Email,
             u.Role
         })
         .ToList();

            return Ok(users);
        }
        [HttpGet]
        public IActionResult AllCurrencies([FromQuery]int? currencyId = null)
        {
            // Get all currency codes currently in use
            var usedCodes = _context.Currencies
                .Where(c => !currencyId.HasValue || c.Id != currencyId.Value) // exclude the current currency in edit mode
                .Select(c => c.Code)
                .ToList();

            // Get the currency code of the one being edited (if any)
            var editingCurrencyCode = currencyId.HasValue
                ? _context.Currencies.Where(c => c.Id == currencyId.Value).Select(c => c.Code).FirstOrDefault()
                : null;

            // Get available currencies that are NOT in use OR are the one currently being edited
            var available = _context.AllCurrencies
                .Where(ac => !usedCodes.Contains(ac.Code) || ac.Code == editingCurrencyCode)
                .Select(ac => new
                {
                    ac.Code,
                    ac.Name,
                    ac.Symbol,
                    ac.CountryCode
                })
                .ToList();

            return Ok(available);
        }




        [HttpGet]
        public IActionResult ConversionsFor(int currencyId)
        {
            var currency = _context.Currencies.Find(currencyId);
            if (currency == null) return NotFound();

            var conversions = _context.ConversionRates
                .Include(r => r.FromCurrency)
                .Include(r => r.ToCurrency)
                .Where(c => c.FromCurrency.Code == currency.Code || c.ToCurrency.Code == currency.Code)
                .Select(c => new
                {
                    from = c.FromCurrency.Code,
                    fromCountry = c.FromCurrency.CountryCode,
                    to = c.ToCurrency.Code,
                    toCountry = c.ToCurrency.CountryCode,
                    rate = c.Rate
                })
                .ToList();

            return Ok(conversions);
        }
        [HttpPost]
        public IActionResult AddUpdateCurrency(int currencyId, [FromBody] CurrencyUpdateDto payload)
        {
            if (payload == null || payload.Currency == null)
                return BadRequest("Invalid data");

            if (currencyId == 0)
            {
                // ADD logic
                var exists = _context.Currencies.Any(c => c.Code == payload.Currency.Code);
                if (exists) return BadRequest("Currency already exists.");

                var newCurrency = new Entities.Currencies
                {
                    Code = payload.Currency.Code,
                    Name = payload.Currency.Name,
                    Symbol = payload.Currency.Symbol,
                    CountryCode = payload.Currency.CountryCode
                };

                _context.Currencies.Add(newCurrency);
                _context.SaveChanges();

                // Save conversions
                foreach (var conv in payload.Conversions)
                {
                    var fromId = _context.Currencies.Where(c => c.Code == conv.From).Select(c => c.Id).FirstOrDefault();
                    var toId = _context.Currencies.Where(c => c.Code == conv.To).Select(c => c.Id).FirstOrDefault();

                    _context.ConversionRates.Add(new Entities.ConversionRates
                    {
                        FromCurrencyId = fromId,
                        ToCurrencyId = toId,
                        Rate = conv.Rate
                    });
                }

                _context.SaveChanges();
                return Ok("Currency added.");
            }
            else
            {
                // EDIT logic
                var existing = _context.Currencies.FirstOrDefault(c => c.Id == currencyId);
                if (existing == null) return NotFound();

                // Optionally update existing fields if editable
                // existing.Name = payload.Currency.Name;

                // Remove existing conversions and add new ones
                var toRemove = _context.ConversionRates
                    .Where(r => r.FromCurrency.Code == existing.Code || r.ToCurrency.Code == existing.Code);
                _context.ConversionRates.RemoveRange(toRemove);

              
                foreach (var conv in payload.Conversions)
                {
                    var fromId = _context.Currencies.Where(c => c.Code == conv.From).Select(c => c.Id).FirstOrDefault();
                    var toId = _context.Currencies.Where(c => c.Code == conv.To).Select(c => c.Id).FirstOrDefault();

                    _context.ConversionRates.Add(new Entities.ConversionRates
                    {
                        FromCurrencyId = fromId,
                        ToCurrencyId = toId,
                        Rate = conv.Rate
                    });
                }

                _context.SaveChanges();
                return Ok("Currency updated.");
            }
        }


        [HttpDelete]
        public IActionResult DeleteCurrency([FromQuery]int id)
        {
            // Find the currency by ID
            var currency = _context.Currencies.FirstOrDefault(c => c.Id == id);
            if (currency == null)
                return NotFound("Currency not found.");

            // Delete all conversion rates where this currency is involved
            var relatedConversions = _context.ConversionRates
                .Where(r => r.FromCurrencyId == id || r.ToCurrencyId == id)
                .ToList();

            _context.ConversionRates.RemoveRange(relatedConversions);

            // Delete the currency itself
            _context.Currencies.Remove(currency);

            _context.SaveChanges();

            return Ok("Currency and related conversions deleted.");
        }

        [HttpDelete]
        public IActionResult DeleteUser([FromQuery] int id)
        {
            // Find the currency by ID
            var user = _context.Users.FirstOrDefault(c => c.Id == id);
            if (user == null)
                return NotFound("User not found.");

            _context.Users.Remove(user);

            _context.SaveChanges();

            return Ok("User deleted successfully!");
        }
        [AllowAnonymous]
        [HttpGet]
        public IActionResult CheckEmailExists(string email)
        {
            var exists = _context.Users.Any(u => u.Email.ToLower() == email.ToLower());
            return Ok(new { exists });
        }
        [HttpPost]
        public IActionResult AddEditUser([FromQuery]int userId, [FromBody] AddEditUserDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Role))
                return BadRequest("Invalid request data.");

            var role = dto.Role.Trim();
            if (role != "Admin" && role != "User")
                return BadRequest("Role must be either 'Admin' or 'User'.");

            if (userId == 0)
            {
                // ADD USER
                if (_context.Users.Any(u => u.Email.ToLower() == dto.Email.ToLower()))
                    return BadRequest("A user with this email already exists.");

                var user = new Users
                {
                    Email = dto.Email.Trim(),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = role
                };

                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok("User added successfully.");
            }
            else
            {
                // UPDATE USER
                var existing = _context.Users.FirstOrDefault(u => u.Id == userId);
                if (existing == null)
                    return NotFound("User not found.");

                if (!string.IsNullOrWhiteSpace(dto.Password))
                {
                    existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                }
                existing.Role = role;
                _context.SaveChanges();
                return Ok("User updated successfully.");
            }
        }

        [HttpPost]
        public IActionResult GeneratePassword([FromQuery]int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return NotFound("User not found.");

            var newPassword = GenerateRandomPassword();
            // Optional: Hash and save it
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            _context.SaveChanges();

            return Ok(newPassword);
        }

        private string GenerateRandomPassword(int length = 10)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

    }
}
