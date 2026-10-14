import {
  ChevronDown,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function StoreHeader() {
  const { itemCount } = useCart();

  return (
    <>
      <div className="store-topbar">
        <div className="store-container store-topbar-inner">
          <span>Nationwide delivery available</span>
          <span>Secure online payments</span>
          <span>Need help? Contact us</span>
        </div>
      </div>

      <header className="store-header">
        <div className="store-container store-header-main">
          <Link to="/" className="store-logo">
            <div className="store-logo-icon">M</div>
            <div>
              <strong>MEGATRONICS</strong>
              <span>Technology for everyone</span>
            </div>
          </Link>

          <div className="store-search">
            <input
              type="text"
              placeholder="Search products..."
            />
            <button>
              <Search size={20} />
            </button>
          </div>

          <div className="store-actions">
            <Link to="/account" className="store-action">
              <User size={21} />
              <div>
                <span>Hello,</span>
                <strong>Account</strong>
              </div>
            </Link>

            <Link to="/cart" className="store-cart">
              <div className="store-cart-icon">
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="cart-count">{itemCount}</span>
                )}
              </div>
              <div>
                <span>Cart</span>
                <strong>View Cart</strong>
              </div>
            </Link>
          </div>
        </div>

        <nav className="store-nav">
          <div className="store-container store-nav-inner">
            <Link to="/products">All Products</Link>

            <button>
              Computers <ChevronDown size={15} />
            </button>

            <button>
              Laptops <ChevronDown size={15} />
            </button>

            <button>
              Phones <ChevronDown size={15} />
            </button>

            <button>
              TVs & Entertainment <ChevronDown size={15} />
            </button>

            <button>
              Appliances <ChevronDown size={15} />
            </button>

            <button>
              Accessories <ChevronDown size={15} />
            </button>

            <Link to="/deals" className="store-nav-deals">
              Deals
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}

export default StoreHeader;