export const handleCardHoverStart = (card, setHoveredCard) => {
    // console.log(card);
    setHoveredCard(null);
    setHoveredCard(card);
};

export const handleCardDragStart = (card, event) => {
    event.dataTransfer.setData("card", JSON.stringify(card));
};

export const handleCardDrop = (event, zoneName, index, zoneType, gameState, setGameState, endCurrentTurn) => {
    event.preventDefault();
    const droppedCard = JSON.parse(event.dataTransfer.getData("card"));

    if (zoneType === "heroZone" && droppedCard.cardType !== "Hero") {
        alert("Solo puedes colocar héroes en esta zona.");
        return;
    }
    if (zoneType === "nexo" && droppedCard.cardType !== "Nexus") {
        alert("Solo puedes colocar cartas Nexo aquí.");
        return;
    }
    if (gameState.player.zones[zoneName][index] !== null) {
        alert("El slot ya está ocupado.");
        return;
    }
    if (
        zoneType === "heroZone" &&
        droppedCard.cardType === "Hero" &&
        droppedCard.chronology.toLowerCase() !== zoneName
    ) {
        alert(`Este héroe pertenece a la zona "${droppedCard.chronology}".`);
        return;
    }
    if (gameState.player.energy < droppedCard.cost) {
        alert("No tienes suficiente energía para jugar esta carta.");
        return;
    }
    if (gameState.currentPlayer === "Oponente") {
        alert("Espera que tu oponente termine su jugada")
        return;
    }

    setGameState((prevState) => {
        const updatedPlayerZones = { ...prevState.player.zones };
        updatedPlayerZones[zoneName][index] = droppedCard;

        const updatedHand = prevState.player.hand.filter(
            (card) => card.uniqueId !== droppedCard.uniqueId
        );

        return {
            ...prevState,
            player: {
                ...prevState.player,
                zones: updatedPlayerZones,
                hand: updatedHand,
                energy: prevState.player.energy - droppedCard.cost,
            },
        };
    });
    endCurrentTurn();
};

export const handleCoinFlip = (choice, gameState, setGameState) => {
    const result = Math.random() < 0.5 ? "cara" : "cruz";
    // setPlayerChoice(choice);
    // setCoinFlipResult(result);

    console.log("Lanzamiento:", result);
    console.log("Elección del jugador:", choice);

    const isPlayerFirst = result === choice;
    const firstPlayer = isPlayerFirst ? "Jugador" : "Oponente";

    setGameState((prevGameState) => ({
        ...prevGameState,
        turn: firstPlayer,
        phase: "setNexus",
        currentPlayer: firstPlayer,
        numberTurn: 1,
    }));

    alert(isPlayerFirst ? "Acertaste! Empiezas el juego" : "Perdiste! El oponente comienza");

    console.log("Fase actual:", gameState.phase);
};