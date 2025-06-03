using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Entities;
using Server.Models;

namespace Server.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ExchangeController : ControllerBase
    {
        private readonly CurrencyExchangeDbContext _context;

        public ExchangeController(CurrencyExchangeDbContext context)
        {
            _context = context;
        }

        // 🔽 Get currencies for dropdowns
        [HttpGet]
        public IActionResult Currencies()
        {
            var currencies = _context.Currencies
                .Select(c => new
                {
                    c.Id,
                    c.Code,
                    c.CountryCode
                })
                .ToList();

            return Ok(currencies);
        }

        // 🔁 Get rate between two currencies
        [HttpGet]
        public IActionResult GetRate([FromQuery] string from, [FromQuery] string to)
        {
            var fromCurrency = _context.Currencies.FirstOrDefault(c => c.Code == from);
            var toCurrency = _context.Currencies.FirstOrDefault(c => c.Code == to);

            if (fromCurrency == null || toCurrency == null)
                return NotFound("Invalid currency code.");

            if (fromCurrency.Id == toCurrency.Id)
                return Ok(new { rate = 1.0 });

            var rate = _context.ConversionRates
                .FirstOrDefault(r => r.FromCurrencyId == fromCurrency.Id && r.ToCurrencyId == toCurrency.Id);

            if (rate == null)
                return NotFound("Conversion rate not available.");

            return Ok(new { rate = rate.Rate });
        }

        // ✅ Convert amount (requires login)
        [Authorize]
        [HttpPost]
        public IActionResult Convert([FromBody] ConvertRequest request)
        {
            var fromCurrency = _context.Currencies.FirstOrDefault(c => c.Code == request.From);
            var toCurrency = _context.Currencies.FirstOrDefault(c => c.Code == request.To);

            if (fromCurrency == null || toCurrency == null)
                return NotFound("Invalid currency code.");

            if (fromCurrency.Id == toCurrency.Id)
                return Ok(new
                {
                    converted = request.Amount,
                    rate = 1.0
                });

            var rate = _context.ConversionRates
                .FirstOrDefault(r => r.FromCurrencyId == fromCurrency.Id && r.ToCurrencyId == toCurrency.Id);

            if (rate == null)
                return NotFound("Conversion rate not available.");

            var result = request.Amount * rate.Rate;

            return Ok(new
            {
                converted = Math.Round(result, 6),
                rate = rate.Rate
            });
        }

        [HttpGet]
        public IActionResult AllRates()
        {
            var result = _context.ConversionRates
                .Select(r => new {
                    From = r.FromCurrency.Code,
                    FromCountry = r.FromCurrency.CountryCode,
                    To = r.ToCurrency.Code,
                    ToCountry = r.ToCurrency.CountryCode,
                    Rate = r.Rate.ToString("0.###")
                }).ToList();

            return Ok(result);
        }


    }
}
