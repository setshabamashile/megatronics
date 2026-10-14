namespace Megatronics.Api.Configuration;

public class PayFastSettings
{
    public string MerchantId { get; set; } = string.Empty;

    public string MerchantKey { get; set; } = string.Empty;

    public string Passphrase { get; set; } = string.Empty;

    public bool Sandbox { get; set; }

    public string FrontendUrl { get; set; } = string.Empty;

    public string PublicApiUrl { get; set; } = string.Empty;
}