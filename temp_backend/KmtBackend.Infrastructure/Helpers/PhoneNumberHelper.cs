namespace KmtBackend.Infrastructure.Helpers
{
    public static class PhoneNumberHelper
    {
        public static string Normalize(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            var digitsOnly = new string(input.Where(char.IsDigit).ToArray());

            if (digitsOnly.StartsWith("20") && digitsOnly.Length > 10)
                digitsOnly = digitsOnly[2..];
            else if (digitsOnly.StartsWith("0020"))
                digitsOnly = digitsOnly[4..];
            else if (digitsOnly.StartsWith('0'))
                digitsOnly = digitsOnly[1..];

            return digitsOnly;
        }
    }
}
