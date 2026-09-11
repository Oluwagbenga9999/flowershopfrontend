import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../utils/uploadImage";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminPage = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    type: "flower",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // images already saved on the product being edited
  const [imageFiles, setImageFiles] = useState([]); // newly selected files, not yet uploaded
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load all products (public route, no auth needed)
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files)); // FileList -> real array
  };

  const authHeaders = { Authorization: `Bearer ${token}` };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload any newly selected files to Cloudinary first
      let images = existingImages;
      if (imageFiles.length > 0) {
        setUploading(true);
        const uploadedUrls = await Promise.all(
          imageFiles.map((file) => uploadImage(file))
        );
        images = uploadedUrls; // replaces existing images with the new selection
        setUploading(false);
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
      };

      if (editingId) {
        await axios.put(`${API}/products/${editingId}`, payload, { headers: authHeaders });
      } else {
        await axios.post(`${API}/products`, payload, { headers: authHeaders });
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", type: "flower", stock: "" });
    setEditingId(null);
    setExistingImages([]);
    setImageFiles([]);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      type: product.type,
      stock: product.stock,
    });
    setExistingImages(product.images || []);
    setImageFiles([]);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API}/products/${id}`, { headers: authHeaders });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete product");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        >
          <option value="flower">Flower</option>
          <option value="planter">Planter</option>
        </select>

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        {/* Multi-image upload */}
        <label className="block mb-1 text-sm text-gray-600">Product Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="border p-2 w-full mb-3"
        />
        {uploading && <p className="text-sm text-gray-500 mb-3">Uploading images...</p>}

        {/* Show currently saved images when editing, if no new files chosen yet */}
        {editingId && existingImages.length > 0 && imageFiles.length === 0 && (
          <div className="flex gap-2 mb-3">
            {existingImages.map((url, i) => (
              <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded border" />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : editingId ? "Update" : "Create"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-3 text-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Product List */}
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded flex justify-between items-center">
            <div className="flex items-center gap-3">
              {product.images?.[0] && (
                <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded" />
              )}
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p>${product.price}</p>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;