import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import GameContext from "../context/BattleContext"
import Hand from "./Hand";
import Field from "./Field";
import PlayerInfo from "./PlayerInfo";
import TurnInfo from "./TurnInfo";
import FancyButton from "./FancyButton";
import { handleCardHoverStart, handleCardDragStart, handleCardDrop, handleCoinFlip } from '../utils/battleHandlers';
import { handleBattle, setNexus, showPhaseChangeNotification, drawCards } from '../utils/gameLogics';
import { setNexusAI, processAIAction } from '../utils/aiLogics';
import "./css/Battle.css";

export default function Battle() {
    const {gameState, setGameState } = useContext(GameContext);

    const gameStateRef = useRef(gameState);

    const [availableNexus, setAvailableNexus] = useState([]);
    const [selectedNexus, setSelectedNexus] = useState(null);
    const [hasDrawnCards, setHasDrawnCards] = useState(false);
    const [phaseTransitioning, setPhaseTransitioning] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [attacker, setAttacker] = useState(null);
    const [defender, setDefender] = useState(null);
    
    const [hoveredCard, setHoveredCard] = useState(null);

    const nextCurrentTurn = (gameState, setGameState) => {
        setGameState((prevState) => ({
            ...prevState,
            currentPlayer: prevState.currentPlayer === "Jugador" ? "Oponente" : "Jugador",
        }));
    };

    const nextPhaseTurn = (phase) => {
        setGameState((prevState) => ({
            ...prevState,
            phase: phase,
        }))
    };

    const placeNexusInChosenSlot = (zones, selectedNexus, slotIndex) => {
        const updatedZones = [...zones];
        if(updatedZones[slotIndex] === null) {
            updatedZones[slotIndex] = selectedNexus;
        }
        else {
            console.error("La posicion ya esta ocupada")
        }
        return updatedZones;
    };

    const handleSetNexusPhase = () => {
        const playerDeck = gameState.player.deck;
        const nexusOptions = setNexus(playerDeck);
        setAvailableNexus(nexusOptions);
    };

    const handleSelectNexus = (nexus) => {
        setSelectedNexus(nexus);
    };
    
    const handleChooseSlot = (slotIndex) => {
        setGameState((prevState) => {
            const updatedZones = placeNexusInChosenSlot(
                prevState.player.zones.nexos,
                selectedNexus,
                slotIndex
            );
            const updatedDeck = prevState.player.deck.filter(
                (card) => card.uniqueId !== selectedNexus.uniqueId
            );
            return {
                ...prevState,
                player: {
                    ...prevState.player,
                    zones: {
                        ...prevState.player.zones,
                        nexos: updatedZones,
                    },
                    deck: updatedDeck,
                    hp: selectedNexus.hp,
                },
            };
        });
        setSelectedNexus(null);
        setAvailableNexus([]);
        if(gameState.turn === "Jugador") {
            nextCurrentTurn(gameState, setGameState);
        }
        else if(gameState.turn === "Oponente") {
            nextCurrentTurn(gameState, setGameState);
            nextPhaseTurn("draw");
        }
    };

    useEffect(() => {
        if (gameState.phase === "setNexus" && gameState.turn === "Oponente" && gameState.currentPlayer === "Oponente") {
            setNexusAI(gameState, setGameState);
            setTimeout(() => {
                nextCurrentTurn(gameState, setGameState);
            }, 0);
        } else if (gameState.phase === "setNexus" && gameState.turn === "Jugador" && gameState.currentPlayer === "Oponente") {
            setNexusAI(gameState, setGameState);
            setTimeout(() => {
                nextPhaseTurn("draw");
                nextCurrentTurn(gameState, setGameState);
            }, 0);
        }
    }, [gameState.phase, gameState.turn, gameState.currentPlayer, setGameState]);
    
    

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No se encontró un Token de autenticación");
                    return;
                }
    
                const deckResponse = await axios.get("http://localhost:3000/api/user/decks", {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                setGameState((prevState) => ({
                    ...prevState,
                    player: {
                        ...prevState.player,
                        deck: deckResponse.data.activeDeck.deck,
                    },
                }));
            } 
            catch (error) {
                console.error("Error al cargar el Deck", error);
                setError("No se pudo cargar el mazo.");
            }
        };
        fetchDeck();
    }, []); 

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        if (gameState.currentPlayer === "Oponente" && gameState.phase === "main") {
            setGameState((prevState) => ({
                ...prevState,
                opponent: {
                    ...prevState.opponent,
                    energy: prevState.opponent.energy + 5,
                },
            }));
    
            const aiTimeout = setTimeout(() => {
                processAIAction(gameStateRef, gameState, setGameState);
            }, 3000);
    
            return () => clearTimeout(aiTimeout);
        }
    }, [gameState.currentPlayer, gameState.phase]);

    const endCurrentTurn = () => {
        setGameState((prevState) => ({
            ...prevState,
            player: {
                ...prevState.player,
                energy: prevState.player.energy + 5,
            },
            currentPlayer: "Oponente",
            numberTurn: prevState.numberTurn + 1,
        }));
    };

    const drawCard = () => {
        console.log("Intentando robar carta...");
        drawCards(1, 'player', setGameState);
        console.log("Después de robar carta, mano del jugador:", gameState.player.hand);
    };
    
    const triggerPhaseTransition = () => {
        setCountdown(3);
        setPhaseTransitioning(true);
    };
    
    useEffect(() => {
        if (phaseTransitioning) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        setPhaseTransitioning(false);
                        
                        nextPhaseTurn("main");
    
                        return prev;
                    }
                    return prev - 1;
                });
            }, 1000);
    
            return () => clearInterval(timer);
        }
    }, [phaseTransitioning]);
    
    useEffect(() => {
        if (gameState.phase === "draw" && !hasDrawnCards) {
            setTimeout(() => {
                drawCards(5, "player", setGameState);
                drawCards(5, "opponent", setGameState);
                setHasDrawnCards(true);
                nextPhaseTurn("main");
            }, 0);
        }
    }, [gameState.phase, hasDrawnCards]);

    const handleSelectHero = (index, zone, isOpponent) => {
        if (gameState.phase === "battle" && gameState.currentPlayer === "Jugador") {
            if (!attacker && !isOpponent) {
                setAttacker({ index, zone });
            } else if (attacker && isOpponent && !defender) {
                setDefender({ index, zone });
            }
        }
    };

    const handleConfirmBattle = () => {
        if (attacker && defender) {
            const updatedGameState = handleBattle(
                gameState,
                attacker.index,
                attacker.zone,
                defender.index,
                defender.zone
            );
            setGameState(updatedGameState);
            setAttacker(null);
            setDefender(null);
        } else {
            alert("Selecciona un atacante y un defensor para continuar.");
        }
    };
    

    return (
        <div className="battle">
            {phaseTransitioning && (
                <div className="phase-alert">
                    <h2>¡La fase cambiará en {countdown} segundos!</h2>
                </div>
            )}

            {gameState.phase === "setNexus" && gameState.currentPlayer === "Jugador" && availableNexus.length === 0 && (
                <div className="modal-overlay-2">
                    <div className="modal-content-2">
                    <FancyButton variant="primary" onClick={handleSetNexusPhase}>
                        Seleccionar de Nexo
                    </FancyButton>
                    </div>
                </div>
            )}

            {availableNexus.length > 0 && !selectedNexus && (
                <div className="modal-overlay-2">
                    <div className="modal-content-2">
                        <h3>Selecciona tu Carta Nexo:</h3>
                        <ul className="nexus-list">
                            {availableNexus.map((nexus) => (
                                <li key={nexus.uniqueId} className="nexus-item">
                                    <img onClick={() => handleSelectNexus(nexus)} src={`../src/assets/Cards/${nexus.image}`} alt={nexus.name} />
                                    {/* <FancyButton variant="primary" onClick={() => handleSelectNexus(nexus)}>
                                        {nexus.name}
                                    </FancyButton> */}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {selectedNexus && (
                <div className="modal-overlay-2">
                    <div className="modal-content-2">
                        <h3>Selecciona una posición para colocar el Nexo:</h3>
                        <ul className="slot-list">
                            {gameState.player.zones.nexos.map((zone, index) => (
                                <li key={index} className="slot-item">
                                    <button
                                        className={`slot-button ${zone ? "occupied" : "available"}`}
                                        disabled={zone !== null}
                                        onClick={() => handleChooseSlot(index)}
                                    >
                                        {zone
                                            ? `Ocupado por: ${zone.name}`
                                            : `Posición ${index + 1}`
                                        }
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {gameState.phase === "battle" && gameState.currentPlayer === "Jugador" && (
                <div className="battle-phase">
                    <h2>Fase de Batalla</h2>
                    <p>Selecciona un héroe como atacante y luego un héroe enemigo como defensor.</p>

                    <div className="selected-heroes">
                        <p>Atacante: {attacker ? `${attacker.zone} - Casilla ${attacker.index}` : "Ninguno seleccionado"}</p>
                        <p>Defensor: {defender ? `${defender.zone} - Casilla ${defender.index}` : "Ninguno seleccionado"}</p>
                    </div>

                    <div className="opponent-field">
                        <h3>Campo del Oponente</h3>
                        {Object.entries(gameState.opponent.zones).map(([zoneName, heroes]) => (
                            <div key={zoneName} className="zone">
                                <h4>{zoneName}</h4>
                                {heroes.map((hero, index) => (
                                    <button
                                        key={index}
                                        className={`hero-button ${defender?.index === index && defender?.zone === zoneName ? "selected" : ""}`}
                                        disabled={!hero}
                                        onClick={() => handleSelectHero(index, zoneName, true)}
                                    >
                                        {hero ? `Héroe (HP: ${hero.hp}, ATK: ${hero.attack})` : "Vacío"}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="player-field">
                        <h3>Tu Campo</h3>
                        {Object.entries(gameState.player.zones).map(([zoneName, heroes]) => (
                            <div key={zoneName} className="zone">
                                <h4>{zoneName}</h4>
                                {heroes.map((hero, index) => (
                                    <button
                                        key={index}
                                        className={`hero-button ${attacker?.index === index && attacker?.zone === zoneName ? "selected" : ""}`}
                                        disabled={!hero}
                                        onClick={() => handleSelectHero(index, zoneName, false)}
                                    >
                                        {hero ? `Héroe (HP: ${hero.hp}, ATK: ${hero.attack})` : "Vacío"}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>


                    <button onClick={handleConfirmBattle} disabled={!attacker || !defender}>
                        Confirmar Batalla
                    </button>
                </div>
            )}

            {gameState.currentPlayer === null ? (
                <div className="coin-flip-prompt">
                    <h2>Elige Cara o Cruz</h2>
                    <button onClick={() => handleCoinFlip("cara", gameState, setGameState)}>Cara</button>
                    <button onClick={() => handleCoinFlip("cruz", gameState, setGameState)}>Cruz</button>

                </div>
            ) : (
                <>
                    <div className="card-info">
                        {hoveredCard ? (
                            <>
                                <h2 className="card-name">{hoveredCard.name}</h2>
                                <img src={`../src/assets/Cards/${hoveredCard.image}`} alt={hoveredCard.name || "Card"} />
                                <p>Costo: {hoveredCard.cost}</p>
                                <p>Tipo: {hoveredCard.cardType}</p>
                                <p>Descripcion: {hoveredCard.description}</p>
                            </>
                        ) : (
                            <p>Posa el cursor sobre una carta para ver los detalles</p>
                        )}
                    </div>
                    <div className="control-info">
                        <PlayerInfo title="Jugador" hp={gameState.player.hp} energy={gameState.player.energy} />
                        <TurnInfo numberTurn={gameState.numberTurn} phase={gameState.phase} currentPlayer={gameState.currentPlayer} endCurrentTurn={endCurrentTurn} nextPhaseTurn={nextPhaseTurn} />
                        <PlayerInfo title="Oponente" hp={gameState.opponent.hp} energy={gameState.opponent.energy} />
                    </div>
                    <Hand className="opponent-hand" hand={gameState.opponent.hand} onCardDragStart={handleCardDragStart} />
                    <div className="battlefield">
                        <Field player="Player" gameState={gameState} setGameState={setGameState} deck={gameState.player.deck} zones={gameState.player.zones} handleCardDrop={handleCardDrop} drawCard={drawCard} handleCardHoverStart={handleCardHoverStart} setHoveredCard={setHoveredCard} endCurrentTurn={endCurrentTurn} />
                        <Field player="Opponent" gameState={gameState} setGameState={setGameState} deck={gameState.opponent.deck} zones={gameState.opponent.zones} handleCardDrop={handleCardDrop} drawCard={drawCard} handleCardHoverStart={handleCardHoverStart} setHoveredCard={setHoveredCard} endCurrentTurn={endCurrentTurn} />
                    </div>
                    <Hand className="player-hand" hand={gameState.player.hand} onCardDragStart={handleCardDragStart} onCardHoverStart={(card) => handleCardHoverStart(card, setHoveredCard)} />
                    
                </>
            )}
        </div>
    );
}