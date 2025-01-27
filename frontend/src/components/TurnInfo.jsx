import React from "react";
import FancyButton from "./FancyButton";

import './css/TurnInfo.css'

export default function TurnInfo({numberTurn, phase, currentPlayer, endCurrentTurn, nextPhaseTurn}) {
    return (
        <div className="turn-info info">
            <h3>Turno Actual: {numberTurn}</h3>
            <h3>Fase: {phase}</h3>
            <h3>Jugador Actual: {currentPlayer}</h3>
            {currentPlayer === "Jugador" && (
                <div className="control-buttons">
                    <FancyButton variant="primary" onClick={endCurrentTurn}>
                        Pasar instancia
                    </FancyButton>
                    <FancyButton variant="primary" onClick={() => nextPhaseTurn("battle")}>
                        Batallar
                    </FancyButton>
                </div>
            )}
        </div>
    );
};