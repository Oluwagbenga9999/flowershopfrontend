import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts"; // adjust path if needed

export default function ProductGrid() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
        <span className="ml-3 text-gray-600">Loading products…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-600">
        <p className="text-lg font-medium">Failed to load products</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Our Collection</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100 overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 capitalize shrink-0">
                  {product.type}
                </span>
              </div>

              <p className="mt-2 text-lg font-medium text-gray-800">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}