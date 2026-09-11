import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  useEffect(() => {
    if (!id) return;

   

    fetch(`${API}/products/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Product not found");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedImage(0); // reset to first image whenever a new product loads
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg">{error || "Product not found"}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-green-700 hover:underline"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  


  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="text-sm text-green-700 hover:underline mb-6 inline-block"
      >
        ← Back to collection
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            {product.images?.length > 0 ? (
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === i ? "border-green-600" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 capitalize">
              {product.type}
            </span>
            <span
              className={`text-sm ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold text-gray-800 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition
              ${
                product.stock > 0
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}