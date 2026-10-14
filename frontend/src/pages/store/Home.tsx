import {
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="store-home">
      <section className="hero">
        <div className="store-container hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">
              SMART TECHNOLOGY. BETTER LIVING.
            </span>

            <h1>
              Power your world with
              <span> better technology.</span>
            </h1>

            <p>
              Discover computers, electronics, appliances and
              accessories built to keep you connected, productive
              and entertained.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="hero-primary">
                Shop Now
                <ArrowRight size={18} />
              </Link>

              <Link to="/products" className="hero-secondary">
                Explore Products
              </Link>
            </div>

            <div className="hero-trust">
              <div>
                <CheckCircle size={17} />
                <span>Quality products</span>
              </div>

              <div>
                <CheckCircle size={17} />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow"></div>

            <div className="hero-device hero-device-main">
              <div className="device-screen">
                <span>MEGA</span>
                <strong>TECH</strong>
              </div>
            </div>

            <div className="hero-floating-card card-one">
              <Zap size={20} />
              <div>
                <strong>Latest Tech</strong>
                <span>Ready for you</span>
              </div>
            </div>

            <div className="hero-floating-card card-two">
              <Truck size={20} />
              <div>
                <strong>R110 Delivery</strong>
                <span>Nationwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="store-container benefits-grid">
          <div className="benefit">
            <Truck size={28} />
            <div>
              <strong>Nationwide Delivery</strong>
              <span>Only R110 across South Africa</span>
            </div>
          </div>

          <div className="benefit">
            <ShieldCheck size={28} />
            <div>
              <strong>Secure Payments</strong>
              <span>Shop with confidence</span>
            </div>
          </div>

          <div className="benefit">
            <CheckCircle size={28} />
            <div>
              <strong>Quality Products</strong>
              <span>Technology you can trust</span>
            </div>
          </div>

          <div className="benefit">
            <Zap size={28} />
            <div>
              <strong>Great Value</strong>
              <span>Competitive pricing</span>
            </div>
          </div>
        </div>
      </section>

      <section className="store-section">
        <div className="store-container">
          <div className="section-heading">
            <div>
              <span>EXPLORE</span>
              <h2>Shop by category</h2>
              <p>Find the technology you need.</p>
            </div>

            <Link to="/products">
              View all
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="category-grid">
            <Link to="/products" className="category-card category-blue">
              <div className="category-icon">💻</div>
              <h3>Computers</h3>
              <span>Desktops & more</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/products" className="category-card category-purple">
              <div className="category-icon">📱</div>
              <h3>Phones</h3>
              <span>Stay connected</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/products" className="category-card category-orange">
              <div className="category-icon">📺</div>
              <h3>Entertainment</h3>
              <span>TVs & media</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/products" className="category-card category-green">
              <div className="category-icon">🎧</div>
              <h3>Accessories</h3>
              <span>Complete your setup</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="promo-section">
        <div className="store-container">
          <div className="promo-card">
            <div>
              <span>MEGATRONICS DEALS</span>
              <h2>Upgrade your setup.</h2>
              <p>
                Discover products designed for work, entertainment
                and everyday life.
              </p>

              <Link to="/products">
                Shop deals
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="promo-decoration">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;