import React from "react";
import PropTypes from "prop-types";
import "./css/Field.css";

export default function Field({ gameState, setGameState, player, deck, zones, handleCardDrop, drawCard, handleCardHoverStart, setHoveredCard, endCurrentTurn }) {
    return (
        <div className={player === "Player" ? "player-field" : "opponent-field"}>
            <div className="hero-zone">
                {["pasado", "presente", "futuro"].map((zone) => (
                    <div className="zone" key={zone}>
                        <h4>{zone.toUpperCase()}</h4>
                        <div className="zone-slots">
                            {zones[zone].map((card, index) => (
                                <div
                                    key={index}
                                    className="slot"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleCardDrop(e, zone, index, "heroZone", gameState, setGameState, endCurrentTurn)}
                                >
                                    {card && (
                                        <div className="card"
                                            onMouseEnter={() => handleCardHoverStart(card, setHoveredCard)}
                                        >
                                            <img src={`../src/assets/Cards/${card.image}`} alt={card.name || "Card"} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="lower-zone">
                {/* Zona del Deck */}
                <div className="deck-zone slot" onClick={drawCard}>
                    <img src={`../src/assets/Cards/CardSlot.png`} alt="Deck" />
                    <p>x {deck.length}</p>
                </div>

                <div className="nexo-zone">
                    <h4>NEXOS</h4>
                    <div className="zone-slots">
                        {zones.nexos.map((card, index) => (
                            <div
                                key={index}
                                className="slot"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleCardDrop(e, "nexos", index, "nexo")}
                            >
                                {card && (
                                    <div className="card"
                                        onMouseEnter={() => handleCardHoverStart(card, setHoveredCard)}
                                    >
                                        <img src={`../src/assets/Cards/${card.image}`} alt={card.name || "Nexus Card"} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="graveyard-zone slot"></div>
            </div>
        </div>
    );
}

Field.propTypes = {
    zones: PropTypes.shape({
        pasado: PropTypes.array.isRequired,
        presente: PropTypes.array.isRequired,
        futuro: PropTypes.array.isRequired,
        nexos: PropTypes.array.isRequired,
    }).isRequired,
    handleCardDrop: PropTypes.func.isRequired,
    drawCard: PropTypes.func.isRequired,
};