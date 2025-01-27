const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Category = require("../models/Category")
const StoreProduct = require("../models/StoreProduct");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/products", async (req, res) => {
    try {
        const products = await StoreProduct.find().populate("category");
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});


router.post("/products", async (req, res) => {
    try {
        const { name, type, priceInMoney, priceInTokens, image_url, cardsList, category } = req.body;

        if (!name || !type || !image_url || !Array.isArray(cardsList) || !category) {
            return res.status(400).json({ message: "Faltan campos obligatorios, incluyendo la categoría." });
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ message: "La categoría especificada no existe." });
        }

        const newProduct = new StoreProduct({
            name,
            type,
            priceInMoney: priceInMoney ?? null,
            priceInTokens: priceInTokens ?? null,
            image_url,
            cardsList,
            category,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Producto creado exitosamente",
            product: savedProduct,
        });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({
            message: "Hubo un error al crear el producto",
            error: error.message,
        });
    }
});

router.put("/products/:name", async (req, res) => {
    const { name } = req.params;
    const updateData = req.body;
    
    try {
        const updatedProduct = await StoreProduct.findOneAndUpdate(
            { name },
            { $set: updateData },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
            message: "Producto actualizado correctamente",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
});

router.delete("/products/:name", async (req, res) => {
    const { name } = req.params;
    
    try {
        const deletedProduct = await StoreProduct.findOneAndDelete({ name });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
            message: "Producto eliminado correctamente",
            product: deletedProduct
        });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
});

router.post("/purchase", verifyToken, async (req, res) => {
    const { productId, paymentType } = req.body;
    const userId = req.user.id;

    console.log("Request body:", req.body);
    console.log("Usuario:", userId);

    const selectRandomCards = (cardsList, numCards) => {
        console.log("Lista original de cartas:", cardsList);
    
        const validCards = cardsList.filter((card) => card && card.cardId);
        if (validCards.length === 0) {
            console.error("No hay cartas válidas en cardsList.");
            return [];
        }
    
        console.log("Cartas válidas para selección:", validCards);
    
        const selectedCards = [];
        for (let i = 0; i < numCards; i++) {
            const totalWeight = validCards.reduce((sum, card) => sum + card.weight, 0);
    
            if (totalWeight <= 0) {
                console.error("El peso total es inválido:", totalWeight);
                break;
            }
    
            const randomNumber = Math.floor(Math.random() * totalWeight) + 1;
    
            let cumulativeWeight = 0;
            for (const card of validCards) {
                cumulativeWeight += card.weight;
                if (randomNumber <= cumulativeWeight) {
                    console.log(`Carta seleccionada en la iteración ${i}:`, card.cardId);
                    selectedCards.push(card.cardId);
                    break;
                }
            }
        }
    
        console.log("Cartas seleccionadas:", selectedCards);
        return selectedCards;
    };
    
    try {
        const product = await StoreProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (!product.cardsList || !Array.isArray(product.cardsList)) {
            return res.status(400).json({ message: "El producto no tiene una lista de cartas válida" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (!Array.isArray(user.inventory)) {
            user.inventory = [];
        }

        const price = paymentType === "money" ? product.priceInMoney : product.priceInTokens;
        if ((paymentType === "money" && user.money < price) || (paymentType === "tokens" && user.tokens < price)) {
            return res.status(400).json({ message: "Saldo insuficiente" });
        }

        if (paymentType === "money") {
            user.money -= price;
        } else {
            user.tokens -= price;
        }

        const numCards = 5;
        const selectedCardIds = selectRandomCards(product.cardsList, numCards);

        for (const cardId of selectedCardIds) {
            if (!cardId) continue;
            const existingCard = user.inventory.find((item) => 
                item.cardId && item.cardId.toString() === cardId.toString()
            ) || null;

            if (existingCard) {
                existingCard.quantity += 1;
            } else {
                user.inventory.push({ cardId, quantity: 1 });
            }
        }

        await user.save();

        res.status(200).json({
            message: "Compra exitosa",
            money: user.money,
            tokens: user.tokens,
            inventory: user.inventory,
        });
    } catch (error) {
        console.error("Error en la compra:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const { name } = req.query;
        const query = name ? { name: { $regex: name, $options: "i" } } : {};
        const categories = await Category.find(query);
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).json({ message: "Error al obtener las categorías", error: error.message });
    }
});

router.post("/categories", async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    try {
        const newCategory = new Category({
            name,
            description: description || "",
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            message: "Categoría creada exitosamente",
            category: savedCategory,
        });
    } catch (error) {
        console.error("Error al crear categoría:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "El nombre de la categoría ya existe" });
        }

        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.put("/categories/:name", async (req, res) => {
    const { name } = req.params;
    const updateData = req.body;

    try {
        const updatedCategory = await Category.findOneAndUpdate(
            { name: name },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json({
            message: "Categoría actualizada exitosamente",
            category: updatedCategory,
        });
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        res.status(500).json({
            message: "Hubo un error al actualizar la categoría",
            error: error.message,
        });
    }
});

router.delete("/categories/:name", async (req, res) => {
    const { name } = req.params;

    try {
        const deletedCategory = await Category.findOneAndDelete({ name: name });

        if (!deletedCategory) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json({
            message: "Categoría eliminada exitosamente",
            category: deletedCategory,
        });
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        res.status(500).json({
            message: "Hubo un error al eliminar la categoría",
            error: error.message,
        });
    }
});

module.exports = router;