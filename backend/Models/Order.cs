namespace Megatronics.Api.Models;

public class Order
{
    public int Id { get; set; }

    public string OrderNumber { get; set; } = string.Empty;

    public int CustomerId { get; set; }

    public Customer Customer { get; set; } = null!;

    // Delivery information
    public string DeliveryName { get; set; } = string.Empty;

    public string DeliveryPhone { get; set; } = string.Empty;

    public string DeliveryEmail { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Suburb { get; set; } = string.Empty;

    public string Province { get; set; } = string.Empty;

    public string PostalCode { get; set; } = string.Empty;

    // Money
    public decimal Subtotal { get; set; }

    public decimal DeliveryFee { get; set; }

    public decimal Total { get; set; }

    // Payment/order status
    public PaymentStatus PaymentStatus { get; set; }
        = PaymentStatus.Pending;

    public OrderStatus Status { get; set; }
        = OrderStatus.Pending;

    public string? PaymentReference { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; }
        = new List<OrderItem>();
}