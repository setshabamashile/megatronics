import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Cart() {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="store-container">
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={38} />
            </div>

            <h1>Your shopping cart is empty</h1>

            <p>
              You haven't added any products to your cart yet.
              Explore our store and find something you like.
            </p>

            <Link to="/products" className="cart-continue-button">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="store-container">
        <div className="cart-heading">
          <div>
            <span>YOUR SHOPPING BAG</span>
            <h1>Shopping Cart</h1>
            <p>
              You have {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"} in your cart.
            </p>
          </div>

          <Link to="/products" className="continue-shopping">
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>

        <div className="cart-layout">
          <section className="cart-items-card">
            <div className="cart-items-heading">
              <ShoppingCart size={19} />
              <strong>Cart Items ({items.length})</strong>
            </div>

            {items.map((item) => (
              <div className="cart-item" key={item.productId}>
                <div className="cart-item-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="product-image-placeholder">
                      <span>MEGA</span>
                      <strong>TECH</strong>
                    </div>
                  )}
                </div>

                <div className="cart-item-details">
                  <h3>{item.name}</h3>

                  <span className="cart-item-unit-price">
                    R {item.price.toFixed(2)} each
                  </span>

                  <div className="cart-item-controls">
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className="remove-cart-item"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  R {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items ({itemCount})</span>
              <strong>R {subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <strong>R {deliveryFee.toFixed(2)}</strong>
            </div>

            <div className="summary-delivery">
              <Truck size={19} />
              <span>Nationwide delivery at a flat R110 fee.</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <strong>R {total.toFixed(2)}</strong>
            </div>

            <button
              className="checkout-button"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <div className="cart-security-note">
              Secure checkout and online payments.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;