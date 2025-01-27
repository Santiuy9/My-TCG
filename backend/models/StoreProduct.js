const mongoose = require("mongoose");

const storeProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    priceInMoney: {type: Number, default: null},
    priceInTokens: {type: Number, default: null},
    image_url: {type: String, required: true},
    cardsList: [
        {
            cardId: {type: String, required: true},
            weight: {type: Number, required: true}
        },
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

module.exports = mongoose.model("StoreProduct", storeProductSchema, 'Products');