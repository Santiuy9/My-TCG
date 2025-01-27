import React from "react";
import "./css/HandCard.css";

export default function HandCard({ card, onDragStart }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData("card", JSON.stringify(card));
        if (onDragStart) onDragStart(card);
    };

    return (
        <div className="hand-card" draggable onDragStart={handleDragStart}>
            <img
                className="hand-card-img"
                src={`../src/assets/Cards/${card.image || "CardPlaceholder.png"}`}
                alt={card.name}
            />
            {/* <p className="hand-card-name">{card.name}</p> */}
        </div>
    );
}