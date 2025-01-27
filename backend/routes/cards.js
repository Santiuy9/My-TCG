const express = require("express");
const router = express.Router();
const Card = require('../models/Card');

router.get('/', async (req, res) => {
    try {
        const cards = await Card.find({});
        res.json(cards);
    }
    catch(err) {
        console.error(err)
        res.status(500).send('Error al obtener cartas')
    }
});

module.exports = router;