const express = require("express");
const {verifyToken } = require("../middlewares/verifyToken");
const {getInventory, getDecks, saveActiveDeck, saveDeck} = require("../controllers/deckController");

const router = express.Router();

router.get("/inventory", verifyToken, getInventory);

router.get("/decks", verifyToken, getDecks);

router.post("/deck/active", verifyToken, saveActiveDeck);

router.post("/decks", verifyToken, saveDeck);

module.exports = router;