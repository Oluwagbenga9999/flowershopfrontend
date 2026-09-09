import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const { token } = useAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order || !id) return;

    async function fetchOrder() {
      try {
        const res = await fetch(`${API}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Order not found");
        setOrder(data.order || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id, order, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-red-600 mb-6">{error || "Order not found"}</p>
        <Link to="/orders" className="text-green-700 hover:underline">
          View your orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Thank you for your order!
        </h1>
        <p className="text-gray-500">
          Order <span className="font-mono text-gray-800">#{order._id}</span> has been placed.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Status & Total */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium capitalize">{order.status || "Processing"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold">
              ${Number(order.totalPrice || order.total || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Shipping */}
        {order.shippingAddress && (
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}
              {order.shippingAddress.postalCode && `, ${order.shippingAddress.postalCode}`}<br />
              {order.shippingAddress.phone}
            </p>
          </div>
        )}

        {/* Items */}
        <div>
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-3">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Link
          to="/orders"
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          View Order History
        </Link>
        <Link
          to="/"
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}