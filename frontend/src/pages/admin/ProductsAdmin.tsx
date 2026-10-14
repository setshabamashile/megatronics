import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Product } from "../../types/Product";
import type { Category } from "../../types/Category";

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    specifications: "",
    price: "",
    imageUrl: "",
    stock: "",
    featured: false,
    categoryId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get<Product[]>("/Products"),
        api.get<Category[]>("/Categories"),
      ]);

      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await api.post("/Products", {
        name: form.name,
        slug: form.slug,
        description: form.description,
        specifications: form.specifications,
        price: Number(form.price),
        imageUrl: form.imageUrl || null,
        stock: Number(form.stock),
        featured: form.featured,
        categoryId: form.categoryId
          ? Number(form.categoryId)
          : null,
      });

      alert("Product added successfully.");

      setForm({
        name: "",
        slug: "",
        description: "",
        specifications: "",
        price: "",
        imageUrl: "",
        stock: "",
        featured: false,
        categoryId: "",
      });

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to add product.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        padding: "40px",
        background: "#f5f5f5",
        minHeight: "100vh",
        color: "#111",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>Product Management</h1>
          <p>Manage your Megatronics products.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          {showForm ? "Close Form" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: "25px",
            marginBottom: "30px",
            borderRadius: "8px",
          }}
        >
          <h2>Add New Product</h2>

          <div>
            <label>Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: "10px" }}
            />
          </div>

          <br />

          <div>
            <label>Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              placeholder="example-product"
              style={{ display: "block", width: "100%", padding: "10px" }}
            />
          </div>

          <br />

          <div>
            <label>Category</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: "10px" }}
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <br />

          <div>
            <label>Price (R)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: "10px" }}
            />
          </div>

          <br />

          <div>
            <label>Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: "10px" }}
            />
          </div>

          <br />

          <div>
            <label>Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              style={{ display: "block", width: "100%", padding: "10px" }}
            />
          </div>

          <br />

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              style={{ display: "block", width: "100%", padding: "10px" }}
            />
          </div>

          <br />

          <div>
            <label>Specifications</label>
            <textarea
              name="specifications"
              value={form.specifications}
              onChange={handleChange}
              required
              rows={4}
              placeholder="RAM, storage, processor, screen size, etc."
              style={{ display: "block", width: "100%", padding: "10px" }}
            />
          </div>

          <br />

          <div>
            <label>
              <input
                name="featured"
                type="checkbox"
                checked={form.featured}
                onChange={handleChange}
              />{" "}
              Featured product
            </label>
          </div>

          <br />

          <button
            type="submit"
            style={{
              padding: "12px 25px",
              cursor: "pointer",
            }}
          >
            Save Product
          </button>
        </form>
      )}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "8px",
        }}
      >
        <h2>Products</h2>

        {products.length === 0 ? (
          <p>No products have been added yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px" }}>
                  Product
                </th>
                <th style={{ textAlign: "left", padding: "10px" }}>
                  Category
                </th>
                <th style={{ textAlign: "left", padding: "10px" }}>
                  Price
                </th>
                <th style={{ textAlign: "left", padding: "10px" }}>
                  Stock
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ padding: "10px" }}>
                    {product.name}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {product.category?.name ?? "Uncategorized"}
                  </td>

                  <td style={{ padding: "10px" }}>
                    R {product.price.toFixed(2)}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {product.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductsAdmin;