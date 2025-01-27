import React from "react";

export default function PlayerInfo({title, hp, energy}) {
    return (
        <div className="player-info info">
            <h3>{title}</h3>
            <p>HP: {hp}</p>
            <p>Energias Temporales: {energy}</p>
        </div>
    );
};