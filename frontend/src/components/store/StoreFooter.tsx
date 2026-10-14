import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-container">
        <div className="store-footer-grid">
          <div className="store-footer-brand">
            <div className="store-footer-logo">
              <div className="store-logo-icon">M</div>
              <strong>MEGATRONICS</strong>
            </div>

            <p>
              Quality technology, electronics and appliances at
              competitive prices.
            </p>

            <div className="store-socials">
              <a href="#" aria-label="Facebook">
                f
              </a>

              <a href="#" aria-label="Instagram">
                ◎
              </a>

              <a href="#" aria-label="Twitter">
                𝕏
              </a>
            </div>
          </div>

          <div>
            <h3>Shop</h3>
            <Link to="/products">All Products</Link>
            <Link to="/products">Computers</Link>
            <Link to="/products">Phones</Link>
            <Link to="/products">Televisions</Link>
            <Link to="/products">Accessories</Link>
          </div>

          <div>
            <h3>Customer Service</h3>
            <Link to="/account">My Account</Link>
            <Link to="/orders">Track Order</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQs</Link>
          </div>

          <div>
            <h3>Contact</h3>

            <div className="footer-contact">
              <MapPin size={17} />
              <span>South Africa</span>
            </div>

            <div className="footer-contact">
              <Phone size={17} />
              <span>Contact our support team</span>
            </div>

            <div className="footer-contact">
              <Mail size={17} />
              <span>support@megatronics.co.za</span>
            </div>
          </div>
        </div>

        <div className="store-footer-bottom">
          <span>© 2026 Megatronics. All rights reserved.</span>

          <div>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default StoreFooter;