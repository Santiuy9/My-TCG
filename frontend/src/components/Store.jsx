import React, { useEffect, useState } from "react";
import "./css/Store.css";

const Store = ({ money, tokens, setMoney, setTokens }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/store/products");
                if (response.ok) {
                    const data = await response.json();
                    console.log("Productos obtenidos del Backend", data)
                    setProducts(data);
                } else {
                    console.error("Error al obtener los productos");
                }
            } catch (error) {
                console.error("Error al cargar los productos de la tienda:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handlePurchase = async (productId, paymentType) => {
        console.log(productId);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/store/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, paymentType }),
            });
    
            const result = await response.json();
            console.log(result)
            if (response.ok) {
                setMoney(result.money);
                setTokens(result.tokens);
                alert("¡Compra realizada con éxito!");
            } else {
                alert(result.message || "Error al procesar la compra");
            }
        } catch (error) {
            console.error("Error al procesar la compra:", error);
        }
    };
    

    if (isLoading) {
        return <div>Cargando productos...</div>;
    }

    return (
        <div className="store">
            <h1>Tienda</h1>
            <div className="products">
                {products.map((product) => (
                    <div className="product-card" key={product._id}>
                        <h3>{product.name}</h3>
                        <img src={product.image_url} alt={product.name} />
                        <p>{product.description}</p>
                        <p>
                            Precio: {product.priceInMoney ? product.priceInMoney : "-"} monedas o{" "}
                            {product.priceInTokens ? product.priceInTokens : "-"} tokens
                        </p>
                        {product.priceInMoney && (
                            <button onClick={() => handlePurchase(product._id, "money")}>Comprar con Monedas</button>
                        )}
                        {product.priceInTokens && (
                            <button onClick={() => handlePurchase(product._id, "tokens")}>Comprar con Tokens</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;
