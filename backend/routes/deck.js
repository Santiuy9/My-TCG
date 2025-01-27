const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Card = require("../models/Card");
const { verifyToken } = require("../middlewares/verifyToken");

router.get('/inventory', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        const cardIds = user.inventory.map(item => item.cardId);
        const cards = await Card.find({ id: { $in: cardIds } });
        const inventory = user.inventory.map(item => {
            const card = cards.find(c => c.id.toString() === item.cardId);
            return {
                cardId: item.cardId,
                name: card?.name || null,
                type: card?.type || null,
                chronology: card?.chronology || null,
                hp: card?.hp || null,
                cost: card?.cost || null,
                cooldown: card?.cooldown || null,
                attack: card?.attack || null,
                chronologyPrev: card?.chronologyPrev || null,
                chronologyNext: card?.chronologyNext || null,
                description: card?.description || null,
                image: card?.image_url || null,
                quantity: item.quantity,
            };
        });

        return res.status(200).json({ inventory });
    }
    catch (error) {
        console.error("Error al cargar el inventario:", error);
        return res.status(500).json({ message: "Error al cargar el inventario." });
    }
});

// router.post("/deck", verifyToken, async (req, res) => {
//     const userId = req.user.id;
//     const { deck } = req.body;

//     try {
//         // Validar que el mazo no está vacío y es un array
//         if (!deck || !Array.isArray(deck)) {
//             return res.status(400).json({ message: "El mazo debe ser un array válido." });
//         }

//         // Validar el límite del mazo
//         const DECK_LIMIT = 40;
//         const totalCards = deck.reduce((sum, card) => sum + card.quantityInDeck, 0);
//         if (totalCards > DECK_LIMIT) {
//             return res.status(400).json({ message: `El mazo no puede exceder ${DECK_LIMIT} cartas.` });
//         }

//         // Buscar al usuario
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "Usuario no encontrado." });
//         }

//         // Guardar el mazo
//         user.deck = deck;
//         await user.save();

//         res.status(200).json({ message: "Mazo guardado correctamente.", deck: user.deck });
//     } catch (error) {
//         console.error("Error al guardar el mazo:", error);
//         res.status(500).json({ message: "Error al guardar el mazo." });
//     }
// });

router.get("/decks", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        res.json({
            activeDeck: user.decks.activeDeck || { name: "Mazo Activo", deck: [] },
            savedDecks: user.decks.savedDecks || [],
        });
    } catch (error) {
        console.error("Error al obtener los mazos:", error);
        res.status(500).json({ message: "Error al obtener los mazos." });
    }
});

router.post("/deck/active", verifyToken, async (req, res) => {
    const { name, deck, inventory } = req.body;
    // console.log("Datos recibidos (name):", name);
    console.log("Datos recibidos (deck):", deck);
    // console.log("Datos recibidos (inventory):", inventory);

    
    if (!deck || deck.length === 0) {
        return res.status(400).json({ message: "El mazo no puede estar vacío." });
    }
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        
        user.decks.activeDeck = { name: name || "Mazo Activo", deck };
        user.inventory = inventory;
        
        console.log(deck);
        // console.log(user)
        // console.log(user.decks)
        await user.save();

        res.json({ message: "Mazo activo guardado correctamente." });
    } catch (error) {
        console.error("Error al guardar el mazo activo:", error);
        res.status(500).json({ message: "Error al guardar el mazo activo." });
    }
});

router.post("/decks", verifyToken, async (req, res) => {
    const { name, deck } = req.body;

    if (!name || !deck || deck.length === 0) {
        return res.status(400).json({ message: "Nombre del mazo y su contenido son obligatorios." });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        user.decks.savedDecks.push({ name, deck });
        await user.save();

        res.json({ message: "Nuevo mazo guardado correctamente." });
    } catch (error) {
        console.error("Error al guardar el nuevo mazo:", error);
        res.status(500).json({ message: "Error al guardar el nuevo mazo." });
    }
});

// router.post("/deck/load", verifyToken, async (req, res) => {
//     const { deckName } = req.body;

//     if (!deckName) {
//         return res.status(400).json({ message: "El nombre del mazo es obligatorio." });
//     }

//     try {
//         const user = await User.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({ message: "Usuario no encontrado." });
//         }

//         const savedDeck = user.decks.savedDecks.find((deck) => deck.name === deckName);
//         if (!savedDeck) {
//             return res.status(404).json({ message: "El mazo no fue encontrado." });
//         }

//         user.decks.activeDeck = { name: savedDeck.name, deck: savedDeck.deck };
//         await user.save();

//         res.json({ message: "Mazo cargado como activo correctamente.", activeDeck: user.decks.activeDeck });
//     } catch (error) {
//         console.error("Error al cargar el mazo:", error);
//         res.status(500).json({ message: "Error al cargar el mazo." });
//     }
// });

module.exports = router;