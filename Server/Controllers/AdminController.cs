using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Entities;
using Server.Models;

namespace Server.Controllers
{
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
        [Authorize(Roles = "Admin")]
        public IActionResult Users()
        {
            var users = _context.Users
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

    }
}
