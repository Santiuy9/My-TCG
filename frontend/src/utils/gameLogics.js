export const setNexus = (deck) => {
    const nexusInDeck = deck.filter((cards) => cards.cardType === "Nexus");
    return nexusInDeck;
};

export const changePhase = (nextPhase, setGameState) => {
    if (!nextPhase) {
        console.error("No se proporcionó la siguiente fase.");
        return;
    }

    setGameState((prevState) => {
        const isDrawPhase = nextPhase === "draw";

        return {
            ...prevState,
            phase: nextPhase,
            turn: isDrawPhase 
                ? (prevState.turn === "Jugador" ? "Oponente" : "Jugador")
                : prevState.turn,
            hasDrawnCards: isDrawPhase ? false : prevState.hasDrawnCards,
        };
    });
};

export const showPhaseChangeNotification = (phaseName, setPhaseChanging, setGamePhase, duration = 2000) => {
    setPhaseChanging(true);

    setTimeout(() => {
        setPhaseChanging(false);
        setGamePhase(phaseName);
    }, duration);
};

export const drawCards = (numCards, deckType, setGameState) => {
    // console.log("===> drawCards Invocada");
    // console.log("Número de cartas a robar:", numCards);
    // console.log("Tipo de mazo:", deckType);

    setGameState((prevState) => {
        // console.log("Estado actual del juego:", prevState);

        const isPlayer = deckType === "player";
        const target = isPlayer ? "player" : "opponent";
        // console.log("Target definido:", target);

        const currentDeck = prevState[target].deck;
        // console.log("Mazo actual del target:", currentDeck);

        if (!currentDeck || currentDeck.length === 0) {
            // console.error("El mazo está vacío o no existe.");
            return prevState;
        }

        const minCardsToDraw = Math.min(currentDeck.length, numCards);
        // console.log("Cartas que se van a robar realmente:", minCardsToDraw);

        const updatedDeck = [...currentDeck];
        const cardsDrawn = updatedDeck.splice(0, minCardsToDraw);
        // console.log("Cartas robadas:", cardsDrawn);
        // console.log("Mazo actualizado:", updatedDeck);

        return {
            ...prevState,
            [target]: {
                ...prevState[target],
                deck: updatedDeck,
                hand: [...prevState[target].hand, ...cardsDrawn],
            },
        };
    });
};

export function handleBattle(gameState, attackerIndex, attackerZone, defenderIndex, defenderZone) {
    if (gameState.phase !== "battle" || gameState.currentPlayer !== "Jugador") {
      return gameState;
    }
    const { player, opponent } = gameState;
    const attackerHero = player.zones[attackerZone][attackerIndex];
    const defenderHero = opponent.zones[defenderZone][defenderIndex];
    if (!attackerHero || !defenderHero) {
      console.error("Selecciona un héroe válido como atacante o defensor.");
      return gameState;
    }
    defenderHero.hp -= attackerHero.attack;
    if (defenderHero.hp <= 0) {
      opponent.zones[defenderZone][defenderIndex] = null;
    }
    return {
      ...gameState,
      opponent: {
        ...opponent,
        zones: {
          ...opponent.zones,
          [defenderZone]: [...opponent.zones[defenderZone]],
        },
      },
      player: {
        ...player,
        zones: {
          ...player.zones,
          [attackerZone]: [...player.zones[attackerZone]],
        },
      },
      currentPlayer: "Oponente",
    };
}
  