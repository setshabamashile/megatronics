import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types/Product";

function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Product[]>("/Products");

        const foundProduct = response.data.find(
          (item) => item.slug === slug
        );

        if (!foundProduct) {
          setError("The product you are looking for was not found.");
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Unable to load this product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      stock: product.stock,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="store-container product-details-loading">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="store-container product-details-error">
        <h2>Product unavailable</h2>
        <p>{error}</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="product-details-page">
      <div className="store-container">
        <Link to="/products" className="back-to-products">
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="product-details-card">
          <div className="product-details-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="product-image-placeholder">
                <span>MEGA</span>
                <strong>TECH</strong>
              </div>
            )}
          </div>

          <div className="product-details-info">
            <span className="details-category">
              {product.category?.name ?? "Technology"}
            </span>

            {product.featured && (
              <span className="details-featured">
                Featured Product
              </span>
            )}

            <h1>{product.name}</h1>

            <div className="details-price">
              R {product.price.toFixed(2)}
            </div>

            <div
              className={`details-stock ${
                outOfStock ? "unavailable" : ""
              }`}
            >
              <span></span>
              {outOfStock
                ? "Currently out of stock"
                : `${product.stock} available in stock`}
            </div>

            <div className="details-divider"></div>

            <h3>Description</h3>
            <p className="details-description">
              {product.description || "No description available."}
            </p>

            <div className="details-divider"></div>

            <h3>Specifications</h3>
            <p className="details-specifications">
              {product.specifications || "Specifications not provided."}
            </p>

            <div className="details-delivery">
              <Truck size={21} />
              <div>
                <strong>Nationwide delivery</strong>
                <span>Flat delivery fee of R110.</span>
              </div>
            </div>

            <div className="details-purchase">
              <div className="quantity-control">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className="details-add-button"
                onClick={handleAddToCart}
                disabled={outOfStock}
              >
                {added ? <Check size={19} /> : <ShoppingCart size={19} />}
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>

            {added && (
              <Link to="/cart" className="view-cart-message">
                View your shopping cart
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;