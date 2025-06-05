namespace Server.Models
{
    public class ConvertRequest
    {
        public decimal Amount { get; set; }
        public string From { get; set; }
        public string To { get; set; }
    }

}
