import { useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";
import api from "../../services/api";
import type { Category } from "../../types/Category";

function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get<Category[]>("/Categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setEditingId(null);
    setShowForm(false);
  };

  const createSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);

    if (!editingId) {
      setSlug(createSlug(value));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingId !== null) {
        await api.put(`/Categories/${editingId}`, {
          id: editingId,
          name,
          slug,
        });
      } else {
        await api.post("/Categories", {
          name,
          slug,
        });
      }

      await loadCategories();
      resetForm();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category.");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/Categories/${id}`);
      await loadCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category.");
    }
  };

  if (loading) {
    return <div className="page-loading">Loading categories...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Organise your Megatronics products.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Close" : "Add Category"}
        </button>
      </div>

      {showForm && (
        <div className="card category-form-card">
          <div className="form-header">
            <div>
              <h2>
                {editingId !== null
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p>
                Create a category for organising your products.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="category-form-grid">
              <div className="form-group">
                <label htmlFor="category-name">
                  Category Name
                </label>

                <input
                  id="category-name"
                  className="form-control"
                  value={name}
                  onChange={(event) =>
                    handleNameChange(event.target.value)
                  }
                  placeholder="e.g. Laptops"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category-slug">
                  Slug
                </label>

                <input
                  id="category-slug"
                  className="form-control"
                  value={slug}
                  onChange={(event) =>
                    setSlug(event.target.value)
                  }
                  placeholder="e.g. laptops"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingId !== null
                  ? "Update Category"
                  : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card admin-table-card">
        <div className="table-header">
          <div>
            <h2>All Categories</h2>
            <span>
              {categories.length} categories
            </span>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="empty-state">
            <TagsIcon />
            <h3>No categories yet</h3>
            <p>
              Add your first category to start organising
              products.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>#{category.id}</td>

                    <td>
                      <strong>{category.name}</strong>
                    </td>

                    <td>
                      <span className="slug-badge">
                        {category.slug}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button edit"
                          onClick={() =>
                            handleEdit(category)
                          }
                          title="Edit"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          className="icon-button delete"
                          onClick={() =>
                            handleDelete(category.id)
                          }
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TagsIcon() {
  return (
    <div className="empty-state-icon">
      <span>TAG</span>
    </div>
  );
}

export default CategoriesAdmin;