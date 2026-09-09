import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);


function addToCart(product, quantity = 1) {
    setItems((prev) => {
        const existing = prev.find((i)=> i._id === product._id);
        if (existing) {
            return prev.map((i) => 
                i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
            );
        }
        return [...prev, { ...product, quantity }];
    });
}

function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i._id !== productId));
}

function updateQuantity(productId, quantity) {
    setItems((prev) => 
        prev.map((i) => (i._id === productId ? { ...i, quantity } : i))
    );
}

function clearCart() {
    setItems([]);
}

const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

return (
    <CartContext.Provider
    value={{items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice}}>
        {children}
    </CartContext.Provider>
);
};

export function useCart() {
    return useContext(CartContext);
}