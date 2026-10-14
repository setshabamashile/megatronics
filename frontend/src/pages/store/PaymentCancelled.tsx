import { ArrowLeft, CreditCard } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

function PaymentCancelled() {
  const [params] = useSearchParams();

  const orderNumber = params.get("order");

  return (
    <div className="payment-result">
      <div className="payment-result-card">
        <div className="payment-cancel-icon">
          <CreditCard size={55} />
        </div>

        <span>PAYMENT CANCELLED</span>

        <h1>Your payment was cancelled</h1>

        <p>
          Your order has not been marked as paid.
          You can return to the store and try again.
        </p>

        {orderNumber && (
          <div className="payment-order-number">
            <small>Order Number</small>
            <strong>{orderNumber}</strong>
          </div>
        )}

        <Link
          to="/cart"
          className="payment-result-button"
        >
          <ArrowLeft size={17} />
          Return to Cart
        </Link>
      </div>
    </div>
  );
}

export default PaymentCancelled;