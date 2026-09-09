import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function CartPage() {
    const {
        items,
        totalItems,
        updateQuantity,
        removeFromCart,
        totalPrice,
        clearCart,
    } = useCart();

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if (totalItems === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart</h1>
                <p className="text-gray-500 mb-8">Your cart is empty.</p>
                <Link
                    to="/"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
                <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                >
                    Clear cart
                </button>
            </div>

            {/* Cart items */}
            <div className="space-y-4 mb-10">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
                    >
                        {/* Image (optional) */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                    No img
                                </div>
                            )}
                        </div>

                        {/* Name + price */}
                        <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-gray-900 truncate">
                                {item.name}
                            </h2>
                            <p className="text-gray-600 mt-0.5">
                                ${item.price.toFixed(2)} each
                            </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-medium
                           hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                −
                            </button>

                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (!isNaN(value) && value >= 1) {
                                        updateQuantity(item._id, value);
                                    }
                                }}
                                className="w-14 text-center border border-gray-300 rounded-md py-1"
                            />

                            <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-medium
                           hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>

                        {/* Line total + remove */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-32">
                            <span className="font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                        ${totalPrice.toFixed(2)}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to="/"
                        className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition"
                    >
                        Continue Shopping
                    </Link>
                    <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                        onClick={() => {
                            if (isAuthenticated) {
                                navigate("/checkout");
                            } else {
                                navigate("/login", { state: { from: { pathname: "/checkout" } } });
                            }
                        }}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}