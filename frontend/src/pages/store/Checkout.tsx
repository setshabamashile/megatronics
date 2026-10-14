import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  province: string;
  postalCode: string;
}

function Checkout() {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    suburb: "",
    province: "",
    postalCode: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const updateField = (
    field: keyof CheckoutForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post("/Orders", {
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },

        delivery: {
          name: `${form.firstName} ${form.lastName}`,
          phone: form.phone,
          email: form.email,
          address: form.address,
          suburb: form.suburb,
          province: form.province,
          postalCode: form.postalCode,
        },

        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      const createdOrderId = response.data.id;
        const createdOrderNumber = response.data.orderNumber;

        
        setOrderNumber(createdOrderNumber);

        try {
        const paymentResponse = await api.post(
            `/Payments/create/${createdOrderId}`
        );

        clearCart();

        const paymentUrl =
            paymentResponse.data.paymentUrl;

        const fields =
            paymentResponse.data.fields;

        const form =
            document.createElement("form");

        form.method = "POST";
        form.action = paymentUrl;

        Object.entries(fields).forEach(
            ([name, value]) => {
            const input =
                document.createElement("input");

            input.type = "hidden";
            input.name = name;
            input.value = String(value);

            form.appendChild(input);
            }
        );

        document.body.appendChild(form);

        form.submit();
        } catch (paymentError) {
        console.error(
            "Payment creation failed:",
            paymentError
        );

        setError(
            "Your order was created, but we could not start the payment. Please contact support with your order number."
        );
        }
    } catch (err: any) {
      console.error("Checkout failed:", err);

      setError(
        err?.response?.data?.message ||
          "We could not create your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={45} />

        <h1>Your cart is empty</h1>

        <p>Add products to your cart before checking out.</p>

        <Link to="/products" className="checkout-primary-button">
          Browse Products
        </Link>
      </div>
    );
  }

  if (orderNumber) {
    return (
      <div className="checkout-success">
        <div className="checkout-success-icon">
          <CheckCircle size={55} />
        </div>

        <span>ORDER CREATED</span>

        <h1>Thank you for your order!</h1>

        <p>
          Your order has been received and is waiting for payment.
        </p>

        <div className="order-number-card">
          <span>Order Number</span>
          <strong>{orderNumber}</strong>
        </div>

        <p className="payment-next-step">
          Payment will be connected to PayFast in the next step.
        </p>

        <Link
          to="/"
          className="checkout-primary-button"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="store-container">
        <Link to="/cart" className="checkout-back">
          <ArrowLeft size={17} />
          Back to Cart
        </Link>

        <div className="checkout-header">
          <span>MEGATRONICS CHECKOUT</span>
          <h1>Complete your order</h1>
          <p>
            Enter your delivery details and review your order.
          </p>
        </div>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <form
          className="checkout-layout"
          onSubmit={handleSubmit}
        >
          <div className="checkout-form-card">
            <section>
              <div className="checkout-section-heading">
                <div>
                  <strong>Customer Information</strong>
                  <span>How can we contact you?</span>
                </div>
              </div>

              <div className="checkout-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    className="form-control"
                    value={form.firstName}
                    onChange={(e) =>
                      updateField(
                        "firstName",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    className="form-control"
                    value={form.lastName}
                    onChange={(e) =>
                      updateField(
                        "lastName",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) =>
                      updateField(
                        "email",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.phone}
                    onChange={(e) =>
                      updateField(
                        "phone",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="checkout-section-heading">
                <div>
                  <strong>Delivery Address</strong>
                  <span>Where should we deliver your order?</span>
                </div>

                <MapPin size={21} />
              </div>

              <div className="checkout-grid">
                <div className="form-group checkout-full">
                  <label>Street Address</label>
                  <input
                    className="form-control"
                    value={form.address}
                    onChange={(e) =>
                      updateField(
                        "address",
                        e.target.value
                      )
                    }
                    placeholder="House number and street name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Suburb</label>
                  <input
                    className="form-control"
                    value={form.suburb}
                    onChange={(e) =>
                      updateField(
                        "suburb",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Province</label>
                  <select
                    className="form-control"
                    value={form.province}
                    onChange={(e) =>
                      updateField(
                        "province",
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">
                      Select province
                    </option>
                    <option>Gauteng</option>
                    <option>KwaZulu-Natal</option>
                    <option>Western Cape</option>
                    <option>Eastern Cape</option>
                    <option>Free State</option>
                    <option>Limpopo</option>
                    <option>Mpumalanga</option>
                    <option>North West</option>
                    <option>Northern Cape</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    className="form-control"
                    value={form.postalCode}
                    onChange={(e) =>
                      updateField(
                        "postalCode",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>
            </section>

            <div className="checkout-delivery-note">
              <Truck size={20} />

              <div>
                <strong>Nationwide delivery</strong>
                <span>
                  A flat delivery fee of R110 applies to all
                  orders.
                </span>
              </div>
            </div>
          </div>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="checkout-products">
              {items.map((item) => (
                <div
                  className="checkout-product"
                  key={item.productId}
                >
                  <div className="checkout-product-image">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                      />
                    ) : (
                      <span>M</span>
                    )}
                  </div>

                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <strong>
                    R{" "}
                    {(item.price * item.quantity).toFixed(
                      2
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <strong>R {subtotal.toFixed(2)}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Delivery</span>
              <strong>R {deliveryFee.toFixed(2)}</strong>
            </div>

            <div className="checkout-summary-divider"></div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>R {total.toFixed(2)}</strong>
            </div>

            <button
              type="submit"
              className="checkout-submit"
              disabled={submitting}
            >
              <Lock size={17} />

              {submitting
                ? "Creating Order..."
                : "Continue to Payment"}
            </button>

            <p className="checkout-secure">
              Your payment will be securely processed through
              PayFast.
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;