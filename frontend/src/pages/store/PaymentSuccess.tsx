import { CheckCircle, ShoppingBag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const [params] = useSearchParams();

  const orderNumber = params.get("order");

  return (
    <div className="payment-result payment-success">
      <div className="payment-result-card">
        <div className="payment-result-icon">
          <CheckCircle size={55} />
        </div>

        <span>PAYMENT COMPLETE</span>

        <h1>Thank you for your purchase!</h1>

        <p>
          Your payment was submitted successfully.
          Your order will be processed once PayFast
          confirms the transaction.
        </p>

        {orderNumber && (
          <div className="payment-order-number">
            <small>Order Number</small>
            <strong>{orderNumber}</strong>
          </div>
        )}

        <Link
          to="/products"
          className="payment-result-button"
        >
          <ShoppingBag size={17} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;