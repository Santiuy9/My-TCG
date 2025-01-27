import React from "react";
import "./css/ControlPanel.css";

export default function ControlPanel({ resources, onShuffleDeck, onEndTurn }) {
    return (
        <div className="controls">
            <div className="players-info">
                <p>Recursos: {resources}</p>

            </div>
            <div className="butitons">
                <button onClick={onShuffleDeck}>Mezclar Mazo</button>
                <button onClick={onEndTurn}>Finalizar Turno</button>

            </div>
        </div>
    );
}
