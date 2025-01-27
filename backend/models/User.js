const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
// const { default: Deck } = require("../../frontend/src/components/Deck");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    money: {type: Number, default: 1000},
    tokens: {type: Number, default: 50},
    inventory: [
        {
            cardId: {type: String, required: true},
            quantity: {type: Number, default: 1}
        }
    ],
    decks: {
        activeDeck: {
            name: String,
            deck: [
                {
                    cardId: String,
                    name: String,
                    cardType: String,
                    chronology: String,
                    hp: Number,
                    cost: Number,
                    cooldown: Number,
                    attack: Number,
                    chronologyPrev: String,
                    chronologyNext: String,
                    description: String,
                    image: String,
                    uniqueId: String,
                },
            ],
        },
        savedDecks: [
            {
                name: {type: String, required: true},
                deck: [
                    {
                        cardId: String,
                        name: String,
                        image: String,
                        quantityInDeck: Number,
                        uniqueId: String,
                    },
                ],
            }
        ],
    },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema, 'Users');