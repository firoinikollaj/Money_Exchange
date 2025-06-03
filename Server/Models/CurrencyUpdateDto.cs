namespace Server.Models
{
    public class CurrencyUpdateDto
    {
        public CurrencyDto Currency { get; set; }
        public List<ConversionDto> Conversions { get; set; }
    }

    public class CurrencyDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public string CountryCode { get; set; }
    }

    public class ConversionDto
    {
        public string From { get; set; }
        public string To { get; set; }
        public decimal Rate { get; set; }
    }
}
