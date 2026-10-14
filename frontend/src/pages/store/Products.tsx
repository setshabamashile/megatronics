import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import type { Category, Product } from "../../types/Product";
import ProductCard from "../../components/store/ProductCard";

type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "name";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    number | null
  >(null);

  const [sort, setSort] = useState<SortOption>("featured");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, categoriesResponse] =
        await Promise.all([
          api.get<Product[]>("/Products"),
          api.get<Category[]>("/Categories"),
        ]);

      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(
        "We could not load the products right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      result = result.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm) ||
          product.category?.name
            ?.toLowerCase()
            .includes(searchTerm)
        );
      });
    }

    if (selectedCategory !== null) {
      result = result.filter(
        (product) => product.categoryId === selectedCategory
      );
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name":
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured)
        );
        break;
    }

    return result;
  }, [products, search, selectedCategory, sort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSort("featured");
  };

  const hasFilters =
    search.length > 0 ||
    selectedCategory !== null ||
    sort !== "featured";

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="store-container">
          <span>MEGATRONICS STORE</span>

          <h1>All Products</h1>

          <p>
            Explore our collection of technology, electronics and
            accessories.
          </p>
        </div>
      </section>

      <div className="store-container products-content">
        <div className="products-toolbar">
          <div>
            <strong>
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} products`}
            </strong>

            <span>
              {selectedCategory !== null
                ? " in selected category"
                : " available in our store"}
            </span>
          </div>

          <div className="sort-control">
            <SlidersHorizontal size={17} />

            <label htmlFor="sort">Sort:</label>

            <select
              id="sort"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
            >
              <option value="featured">Featured</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="products-layout">
          <aside className="products-sidebar">
            <div className="sidebar-heading">
              <strong>Filters</strong>

              {hasFilters && (
                <button onClick={clearFilters}>
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>

            <div className="filter-group">
              <label className="filter-label">
                Search
              </label>

              <div className="filter-search">
                <Search size={17} />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products..."
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                Categories
              </label>

              <button
                className={`category-filter ${
                  selectedCategory === null ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Products
                <span>{products.length}</span>
              </button>

              {categories.map((category) => {
                const count = products.filter(
                  (product) =>
                    product.categoryId === category.id
                ).length;

                return (
                  <button
                    key={category.id}
                    className={`category-filter ${
                      selectedCategory === category.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(category.id)
                    }
                  >
                    {category.name}
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="products-results">
            {loading ? (
              <div className="products-loading">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="products-empty">
                <h2>Something went wrong</h2>
                <p>{error}</p>

                <button
                  className="btn btn-primary"
                  onClick={loadProducts}
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="products-empty">
                <div className="products-empty-icon">
                  <Search size={25} />
                </div>

                <h2>No products found</h2>

                <p>
                  Try changing your search or category filter.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Products;