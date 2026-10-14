using System.Net;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Megatronics.Api.Configuration;
using Megatronics.Api.Data;
using Megatronics.Api.Models;
using Megatronics.Api.Services;

namespace Megatronics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly MegatronicsDbContext _context;
    private readonly PayFastService _payFast;
    private readonly PayFastSettings _settings;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(
        MegatronicsDbContext context,
        PayFastService payFast,
        IOptions<PayFastSettings> settings,
        IHttpClientFactory httpClientFactory,
        ILogger<PaymentsController> logger)
    {
        _context = context;
        _payFast = payFast;
        _settings = settings.Value;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpPost("create/{orderId:int}")]
    public async Task<IActionResult> CreatePayment(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        if (order.PaymentStatus == PaymentStatus.Paid)
        {
            return BadRequest(new
            {
                message = "This order has already been paid."
            });
        }

        var paymentData = _payFast.CreatePayment(order);

        return Ok(new
        {
            paymentUrl = _payFast.GetPaymentUrl(),
            fields = paymentData
        });
    }

    [HttpPost("itn")]
    public async Task<IActionResult> HandleItn()
    {
        try
        {
            if (!Request.HasFormContentType)
            {
                return BadRequest();
            }

            var form = await Request.ReadFormAsync();

            var data = form
                .ToDictionary(
                    x => x.Key,
                    x => x.Value.ToString()
                );

            if (!data.TryGetValue(
                    "m_payment_id",
                    out var orderNumber))
            {
                return BadRequest();
            }

            if (!data.TryGetValue(
                    "signature",
                    out var receivedSignature))
            {
                return BadRequest();
            }

            if (!ValidateSignature(data, receivedSignature))
            {
                _logger.LogWarning(
                    "Invalid PayFast signature for {OrderNumber}",
                    orderNumber
                );

                return BadRequest();
            }

            if (!ValidateMerchant(data))
            {
                _logger.LogWarning(
                    "Invalid PayFast merchant for {OrderNumber}",
                    orderNumber
                );

                return BadRequest();
            }

            var order = await _context.Orders
                .FirstOrDefaultAsync(
                    o => o.OrderNumber == orderNumber
                );

            if (order == null)
            {
                return NotFound();
            }

            if (!data.TryGetValue(
                    "amount_gross",
                    out var amountGross))
            {
                return BadRequest();
            }

            if (!decimal.TryParse(
                    amountGross,
                    out var receivedAmount))
            {
                return BadRequest();
            }

            if (Math.Abs(
                    order.Total - receivedAmount) > 0.01m)
            {
                _logger.LogWarning(
                    "PayFast amount mismatch for {OrderNumber}. Expected {Expected}, Received {Received}",
                    order.OrderNumber,
                    order.Total,
                    receivedAmount
                );

                return BadRequest();
            }

            var serverValid =
                await ValidateWithPayFast(data);

            if (!serverValid)
            {
                _logger.LogWarning(
                    "PayFast server validation failed for {OrderNumber}",
                    order.OrderNumber
                );

                return BadRequest();
            }

            if (data.TryGetValue(
                    "payment_status",
                    out var paymentStatus) &&
                paymentStatus.Equals(
                    "COMPLETE",
                    StringComparison.OrdinalIgnoreCase))
            {
                order.PaymentStatus = PaymentStatus.Paid;
                order.Status = OrderStatus.Paid;

                if (data.TryGetValue(
                        "pf_payment_id",
                        out var pfPaymentId))
                {
                    order.PaymentReference = pfPaymentId;
                }

                await _context.SaveChangesAsync();
            }

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error processing PayFast ITN."
            );

            return StatusCode(500);
        }
    }

    private bool ValidateSignature(
        Dictionary<string, string> data,
        string receivedSignature)
    {
        var signatureData =
            new Dictionary<string, string>();

        foreach (var item in data)
        {
            if (item.Key.Equals(
                    "signature",
                    StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            signatureData[item.Key] = item.Value;
        }

        var calculated =
            PayFastService.GenerateSignature(
                signatureData,
                _settings.Passphrase
            );

        return calculated.Equals(
            receivedSignature,
            StringComparison.OrdinalIgnoreCase
        );
    }

    private bool ValidateMerchant(
        Dictionary<string, string> data)
    {
        return data.TryGetValue(
                   "merchant_id",
                   out var merchantId)
               &&
               merchantId == _settings.MerchantId;
    }

    private async Task<bool> ValidateWithPayFast(
        Dictionary<string, string> data)
    {
        var parameterString =
            BuildParameterString(data);

        var client =
            _httpClientFactory.CreateClient();

        using var content =
            new StringContent(
                parameterString,
                Encoding.UTF8,
                "application/x-www-form-urlencoded"
            );

        var response = await client.PostAsync(
            _payFast.GetValidationUrl(),
            content
        );

        if (!response.IsSuccessStatusCode)
        {
            return false;
        }

        var result =
            await response.Content.ReadAsStringAsync();

        return result.Trim()
            .Equals(
                "VALID",
                StringComparison.OrdinalIgnoreCase
            );
    }

    private static string BuildParameterString(
        Dictionary<string, string> data)
    {
        var builder = new StringBuilder();

        foreach (var item in data)
        {
            if (item.Key.Equals(
                    "signature",
                    StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            if (string.IsNullOrWhiteSpace(item.Value))
            {
                continue;
            }

            if (builder.Length > 0)
            {
                builder.Append('&');
            }

            builder.Append(
                item.Key
            );

            builder.Append('=');

            builder.Append(
                Uri.EscapeDataString(
                    item.Value
                ).Replace("%20", "+")
            );
        }

        return builder.ToString();
    }
}