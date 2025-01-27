export const setNexusAI = (gameState, setGameState) => {
    const AIDeck = gameState.opponent.deck;
    const AIZones = gameState.opponent.zones.nexos;

    const availableNexus = AIDeck.filter((card) => (card.cardType === "Nexus"));

    if(availableNexus.length > 0) {
        const selectedNexus = availableNexus[0];
        const emptySlotIndex = AIZones.findIndex((slot) => slot === null);

        if(emptySlotIndex !== -1) {
            setGameState((prevState) => {
                const updatedZones = [...prevState.opponent.zones.nexos];
                updatedZones[emptySlotIndex] = selectedNexus;

                const updatedDeck = prevState.opponent.deck.filter((card) => card.uniqueId !== selectedNexus.uniqueId);

                return {
                    ...prevState,
                    opponent: {
                        ...prevState.opponent,
                        zones: {
                            ...prevState.opponent.zones,
                            nexos: updatedZones,
                        },
                        deck: updatedDeck,
                        hp: selectedNexus.hp,
                    },
                };
            });
        }
        else {
            console.error("No hay espacio disponible en la zona de Nexos de la IA")
        }
    }
    else {
        console.error("La IA no tiene Nexos en su mazo")
    }
};

export const processAIAction = (gameStateRef, gameState, setGameState) => {
    const { hand, energy, zones } = gameStateRef.current.opponent;

    console.log("Mano actual de la IA:", hand);
    console.log("Energía actual de la IA:", energy);

    if (hand.length === 0) {
        console.log("La mano de la IA está vacía. Pasando turno.");
        setGameState((prevState) => ({
            ...prevState,
            currentPlayer: "Jugador",
            numberTurn: prevState.numberTurn + 1,
        }));
        return;
    }

    const availableHeroes = hand.filter(
        (card) => card.cardType === "Hero" && card.cost <= energy
    );

    if (gameState.phase === "main") {
        if (availableHeroes.length > 0) {
            const heroToPlay = availableHeroes[0];
            const zoneToPlaceHero = Object.keys(zones).find(
                (zoneName) =>
                    zones[zoneName].includes(null) &&
                    heroToPlay.chronology.toLowerCase() === zoneName
            );

            if (zoneToPlaceHero) {
                const updatedZones = { ...zones };
                const emptySlotIndex = updatedZones[zoneToPlaceHero].indexOf(null);
                updatedZones[zoneToPlaceHero][emptySlotIndex] = heroToPlay;

                setGameState((prevState) => ({
                    ...prevState,
                    opponent: {
                        ...prevState.opponent,
                        zones: updatedZones,
                        hand: hand.filter((card) => card.uniqueId !== heroToPlay.uniqueId),
                        energy: energy - heroToPlay.cost,
                    },
                    currentPlayer: "Jugador",
                    numberTurn: prevState.numberTurn + 1,
                }));
                return;
            }
        }
    }

    console.log("La IA no tiene acciones posibles y pasa el turno.");
    setGameState((prevState) => ({
        ...prevState,
        currentPlayer: "Jugador",
        numberTurn: prevState.numberTurn + 1,
    }));
};

export const battleAIAction = () => {

}