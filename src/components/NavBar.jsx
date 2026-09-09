import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {

    const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-green-700">
          🌸 Flower Shop
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6">
            {user?.role === "admin" && (
                <Link to="/admin" className="text-gray-700 hover:text-green-700 font-medium transition">
                    Admin
                </Link>
            )}
          <Link
            to="/"
            className="text-gray-700 hover:text-green-700 font-medium transition"
          >
            Shop
          </Link>
          {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-700">Hi, {user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium hover:text-green-700">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}

          {/* Cart Icon with badge */}
          <CartIcon />
        </div>
      </div>
    </nav>
  );
}