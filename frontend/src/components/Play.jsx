import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameProvider } from "../context/BattleContext"
import Battle from './Battle';
import FullScreenModal from "../context/FullScreenModal";
import "./css/Play.css";

export default function Play() {
    const navigate = useNavigate();
    const [isBattleOpen, setBattleOpen] = useState(false);

    return (
        <div className="play-container">
            <div className="play-card">
                <h1 className="play-title">Bienvenido a Batallas</h1>
                <p className="play-description">¡Crea, batalla y domina en el universo de cartas!</p>
                <div className="play-buttons">
                    <button className="play-button battle-button" onClick={() => setBattleOpen(true)}>
                        <span className="button-icon">⚔️</span> Batalla
                    </button>
                    <button className="play-button test-button" onClick={() => alert("Estamos trabajando para implementar este sitio")}>
                        Salón de Pruebas
                    </button>
                </div>
            </div>
            <FullScreenModal isOpen={isBattleOpen} onClose={() => setBattleOpen(false)}>
                <GameProvider>
                    <Battle />
                </GameProvider>
            </FullScreenModal>
        </div>
    );
}