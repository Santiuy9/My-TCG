import React from "react";

const ProductItem = ({ product, money, tokens, handleAddToCart }) => {
    const canAffordWithMoney = product.priceInMoney && money >= product.priceInMoney;
    const canAffordWithTokens = product.priceInTokens && tokens >= product.priceInTokens;

    const handleBuy = () => {
        if (product.type === "booster") {
            if (canAffordWithMoney || canAffordWithTokens) {
                handleAddToCart(product);
            }
            else {
                alert("No tienes suficiente dinero")
            }
        }
        else if (product.type === "card") {
            if (tokens >= product.price) {
                handleAddToCart(product);
            }
            else {
                alert("No tienes suficientes Tokens")
            }
        }
    };

    return (
        <div className="product-item">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>

            {product.type === "booster" ? (
                <div>
                    <p>Precio con Monedas: {product.priceInMoney}</p>
                    <p>Precio con Tokens: {product.priceInTokens}</p>
                </div>
            ) : (
                <p>Precio: {product.price} tokens</p>
            )}

            <button onClick={handleBuy} disabled={!canAffordWithMoney && !canAffordWithTokens}>
                comprar
            </button>
        </div>
    );
};

export default ProductItem