export const nextCurrentTurn = (gameState, setGameState) => {
    setGameState((prevState) => ({
        ...prevState,
        currentPlayer: prevState.currentPlayer === "Jugador" ? "Oponente" : "Jugador",
    }));
};

export const nextPhaseTurn = (setGameState, phase) => {
    setGameState((prevState) => ({
        ...prevState,
        phase: phase,
    }));
};

export const placeNexusInChosenSlot = (zones, selectedNexus, slotIndex) => {
    const updatedZones = [...zones];
    if (updatedZones[slotIndex] === null) {
        updatedZones[slotIndex] = selectedNexus;
    } else {
        console.error("La posición ya está ocupada.");
    }
    return updatedZones;
};