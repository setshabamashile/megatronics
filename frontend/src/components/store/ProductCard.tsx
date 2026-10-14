import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types/Product";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      stock: product.stock,
    });
  };

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.slug}`}
        className="product-image-wrapper"
      >
        {product.featured && (
          <span className="product-badge">
            <Star size={12} fill="currentColor" />
            Featured
          </span>
        )}

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="product-image-placeholder">
            <span>MEGA</span>
            <strong>TECH</strong>
          </div>
        )}
      </Link>

      <div className="product-card-body">
        <span className="product-category">
          {product.category?.name ?? "Technology"}
        </span>

        <Link
          to={`/products/${product.slug}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="product-card-bottom">
          <div>
            <span className="product-price">
              R {product.price.toFixed(2)}
            </span>

            <span
              className={`product-stock ${
                isOutOfStock ? "out-of-stock" : ""
              }`}
            >
              {isOutOfStock
                ? "Out of stock"
                : product.stock <= 5
                  ? `Only ${product.stock} left`
                  : "In stock"}
            </span>
          </div>

          <button
            className="product-cart-button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;