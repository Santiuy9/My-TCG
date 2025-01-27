const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    rarity: {type: String, required: true},
    type: {type: String, required: true},
    synergy: {type: Array, required: true},
    chronology: {type: String, default: null},
    hp: {type: Number, default: null},
    cost: {type: Number, required: true},
    cooldown: {type: Number, default: null},
    attack: {type: Number, default: null},
    description: {type: String, required: true},
    chronology_prev: {type: String, default: null},
    chronology_next: {type: String, default: null},
    image_url: {type: String, required: true}
});

const Card = mongoose.model('Card', CardSchema, 'Cards');

module.exports = Card;