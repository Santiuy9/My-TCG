import React, {createContext, useState} from "react";
import OponentDeck from '../assets/oponentDeck.json'


const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        player: {
            zones: {
                pasado: [null, null, null],
                presente: [null, null, null],
                futuro: [null, null, null],
                nexos: [null, null, null],
            },
            energy: 5,
            hand: [],
            deck: [],
            graveyard: [],
            hp: 0,
        },
        opponent: {
            zones: {
                pasado: [null, null, null],
                presente: [null, null, null],
                futuro: [null, null, null],
                nexos: [null, null, null],
            },
            energy: 0,
            hand: [],
            deck: OponentDeck,
            graveyard: [],
            hp: 0,
        },
        phase: "coinFlip",
        turn: null,
        numberTurn: 1,
        currentPlayer: null,
    });

    return (
        <GameContext.Provider value={{ gameState, setGameState }}>
            {children}
        </GameContext.Provider>
    )
}

export default GameContext;