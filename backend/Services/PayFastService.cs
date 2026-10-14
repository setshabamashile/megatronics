using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Megatronics.Api.Configuration;
using Megatronics.Api.Models;

namespace Megatronics.Api.Services;

public class PayFastService
{
    private readonly PayFastSettings _settings;

    public PayFastService(IOptions<PayFastSettings> settings)
    {
        _settings = settings.Value;
    }

    public Dictionary<string, string> CreatePayment(Order order)
    {
        var data = new Dictionary<string, string>
        {
            ["merchant_id"] = _settings.MerchantId,

            ["merchant_key"] = _settings.MerchantKey,

            ["return_url"] =
                $"{_settings.FrontendUrl}/payment/success?order={order.OrderNumber}",

            ["cancel_url"] =
                $"{_settings.FrontendUrl}/payment/cancelled?order={order.OrderNumber}",

            ["notify_url"] =
                $"{_settings.PublicApiUrl}/api/Payments/itn",

            ["name_first"] = order.Customer.FirstName,

            ["name_last"] = order.Customer.LastName,

            ["email_address"] = order.Customer.Email,

            ["cell_number"] = order.Customer.Phone,

            ["m_payment_id"] = order.OrderNumber,

            ["amount"] = order.Total.ToString("0.00"),

            ["item_name"] = $"Megatronics Order {order.OrderNumber}"
        };

        data["signature"] =
            GenerateSignature(data, _settings.Passphrase);

        return data;
    }

    public static string GenerateSignature(
        IDictionary<string, string> data,
        string? passphrase)
    {
        var builder = new StringBuilder();

        foreach (var item in data)
        {
            if (string.IsNullOrWhiteSpace(item.Value))
            {
                continue;
            }

            builder.Append(item.Key);
            builder.Append('=');
            builder.Append(UrlEncode(item.Value.Trim()));
            builder.Append('&');
        }

        if (builder.Length > 0)
        {
            builder.Length--;
        }

        if (!string.IsNullOrWhiteSpace(passphrase))
        {
            builder.Append("&passphrase=");
            builder.Append(UrlEncode(passphrase.Trim()));
        }

        using var md5 = MD5.Create();

        var bytes = Encoding.UTF8.GetBytes(builder.ToString());

        var hash = md5.ComputeHash(bytes);

        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static string UrlEncode(string value)
    {
        return Uri.EscapeDataString(value)
            .Replace("%20", "+");
    }

    public string GetPaymentUrl()
    {
        return _settings.Sandbox
            ? "https://sandbox.payfast.co.za/eng/process"
            : "https://www.payfast.co.za/eng/process";
    }

    public string GetValidationUrl()
    {
        return _settings.Sandbox
            ? "https://sandbox.payfast.co.za/eng/query/validate"
            : "https://www.payfast.co.za/eng/query/validate";
    }

    public string GetMerchantId()
    {
        return _settings.MerchantId;
    }
}