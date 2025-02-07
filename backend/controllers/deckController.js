const User = require("../models/User");
const Card = require("../models/Card");

const getInventory = async (req, res) => {
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
    } catch (error) {
        console.error("Error al cargar el inventario:", error);
        return res.status(500).json({ message: "Error al cargar el inventario." });
    }
};

const getDecks = async (req, res) => {
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
};

const saveActiveDeck = async (req, res) => {
    const { name, deck, inventory } = req.body;

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

        await user.save();

        res.json({ message: "Mazo activo guardado correctamente." });
    } catch (error) {
        console.error("Error al guardar el mazo activo:", error);
        res.status(500).json({ message: "Error al guardar el mazo activo." });
    }
};

const saveDeck = async (req, res) => {
    const { name, deck } = req.body;

    if (!name || !deck || deck.length === 0) {
        return res.status(400).json({ message: "Nombre del mazo y su contenido son obligatorios." });
    }

    try {
        const user = await User.findById(req.user.id);
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
};

module.exports = {
    getInventory,
    getDecks,
    saveActiveDeck,
    saveDeck,
};