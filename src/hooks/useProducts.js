import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function useProducts(query = "") {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let cancelled = false;

        fetch(`${API}/products${query}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch products");
                return res.json();
            })
            .then((data) => {
                if (!cancelled) {
                    setProducts(data);
                    setError(null);
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [query]);

    return { products, loading, error };

};