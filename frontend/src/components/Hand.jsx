import React from "react";

export default function Hand ({ hand, onCardDragStart, onCardHoverStart, className }) {
    return (
        <div className={className}>
            <div className="hand-slots">
                {hand.map((card, index) => (
                    <div
                        key={index}
                        className="card"
                        draggable
                        onDragStart={(e) => onCardDragStart(card, e)}
                        onMouseEnter={onCardHoverStart ? () => onCardHoverStart(card) : null}
                    >
                        {className === "player-hand" ? (
                            <img
                                src={`../src/assets/Cards/${card.image}`}
                                alt={card.name || "Carta"}
                            />

                        ) : (
                            <img
                                src={`../src/assets/Cards/BakcCard.png`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};