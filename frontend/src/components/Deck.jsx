import React, { useState, useEffect } from "react";
import axios from "axios";

import './css/Deck.css';

const Deck = () => {
    const [inventory, setInventory] = useState([]);
    const [deck, setDeck] = useState([]);
    const [savedDecks, setSavedDecks] = useState([]);
    const [activeDeckName, setActiveDeckName] = useState("Mazo Activo");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const inventoryResponse = await axios.get("http://localhost:3000/api/user/inventory", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInventory(inventoryResponse.data.inventory);

                const deckResponse = await axios.get("http://localhost:3000/api/user/decks", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDeck(deckResponse.data.activeDeck.deck || []);
                setSavedDecks(deckResponse.data.savedDecks || []);
                setActiveDeckName(deckResponse.data.activeDeck.name || "Mazo Activo");
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        fetchData();
    }, []);

    console.log(inventory);
    console.log(deck);

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("cardData", JSON.stringify(card));
    };

    const handleDropOnDeck = (e) => {
        e.preventDefault();
        const card = JSON.parse(e.dataTransfer.getData("cardData"));
        if (card.quantity > 0) {
            addToDeck(card);
        }
    };

    const handleDropOnInventory = (e) => {
        e.preventDefault();
        const card = JSON.parse(e.dataTransfer.getData("cardData"));
        console.log(card);
        if (card.uniqueId) {
            removeFromDeck(card.uniqueId);
        }
    };

    const addToDeck = (card) => {
        console.log(card);
        const deckLimit = 40;
        if (deck.length >= deckLimit) return alert("Has alcanzado el límite de cartas en el mazo.");

        const cardCopiesInDeck = deck.filter((item) => item.cardId === card.cardId).length;
        if (cardCopiesInDeck >= 4) {
            return alert("Solo puedes agregar hasta 4 copias de la misma carta.");
        }

        const cardWithUniqueId = {
            uniqueId: Date.now() + Math.random().toString(36).substr(2, 9),
            cardId: card.cardId,
            name: card.name,
            cardType: card.type,
            chronology: card.chronology,
            hp: card.hp,
            cost: card.cost,
            cooldown: card.cooldown,
            attack: card.attack,
            chronologyPrev: card.chronologyPrev,
            chronologyNext: card.chronologyNext,
            description: card.description,
            image: card.image,
        };
        setDeck([...deck, cardWithUniqueId]);

        const updatedInventory = inventory.map((invCard) =>
            invCard.cardId === card.cardId
                ? { ...invCard, quantity: invCard.quantity - 1 }
                : invCard
        );
        setInventory(updatedInventory);
        console.log(deck);
    };

    const removeFromDeck = (uniqueId) => {
        const updatedDeck = deck.filter((item) => item.uniqueId !== uniqueId);
        const cardToRemove = deck.filter((item) => item.uniqueId == uniqueId);
        console.log(cardToRemove);
        console.log(updatedDeck);
        console.log(uniqueId);
        setDeck(updatedDeck);

        const updatedInventory = inventory.map((invCard) =>
            invCard.cardId === cardToRemove[0].cardId
                ? { ...invCard, quantity: invCard.quantity + 1}
                : invCard
        );
        console.log(updatedInventory);
        setInventory(updatedInventory);
    };

    const saveActiveDeck = () => {
        const token = localStorage.getItem("token");
        console.log(deck);
        console.log(inventory);
        axios
            .post(
                "http://localhost:3000/api/user/deck/active",
                { name: activeDeckName, deck, inventory },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
                
            )
            .then((response) => {
                alert("Mazo activo guardado correctamente.");
                console.log("Mazo activo guardado:", response.data);
            })
            .catch((error) => {
                console.error("Error al guardar el mazo activo:", error);
            }
        );
    };

    return (
        <div className="deck-editor">
            <div className="inventory">
                <h2>Inventario</h2>
                <div className="card-list-inventory" onDragOver={(e) => e.preventDefault()} onDrop={handleDropOnInventory}>
                    {inventory.map((card) => (
                        <div className={`card ${card.quantity === 0 ? "disabled" : ""}`} key={card.cardId} draggable={card.quantity > 0} onDragStart={(e) => handleDragStart(e, card)}>
                            <h3>{card.name}</h3>
                            <img src={`../src/assets/Cards/${card.image}`} alt={card.name} />
                            <p>x {card.quantity}</p>
                            {/* <button onClick={() => addToDeck(card)}>Agregar al Mazo</button> */}
                        </div>
                    ))}
                </div>
            </div>

            <div className="deck" onDragOver={(e) => e.preventDefault()} onDrop={handleDropOnDeck}>
                <div className="deck-info">
                    <h2>{activeDeckName} ({deck.length}/40)</h2>
                    <button onClick={saveActiveDeck}>Guardar Mazo Activo</button>
                </div>
                <div className="card-list-deck">
                    {deck.map((card) => (
                        <div className="card" key={card.uniqueId} draggable onDragStart={(e) => handleDragStart(e, card)}>
                            <img src={`../src/assets/Cards/${card.image}`} alt={card.name} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Deck;