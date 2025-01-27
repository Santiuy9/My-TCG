import React from "react";
import './css/Card.css'

export default function Card({ card, onDragStart }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData("card", JSON.stringify(card));
        if (onDragStart) onDragStart(card);
    }

    return (
        <div
            className= "card"
            draggable= "true"
            onDragStart={handleDragStart} 
        >
            {/* <img src={`../src/assets/Cards/${card.image || "placeholder.png"}`} alt={card.name} /> */}
            {/* <p>{card.name}</p> */}
        </div>
    )
}