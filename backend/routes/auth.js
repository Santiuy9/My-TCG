const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const userExist = await User.findOne({email});
        if (userExist) return res.status(400).json({message: "El email ya esta en uso."});

        const newUser = new User({username, email, password});
        await newUser.save();

        res.status(201).json({message: "Usuario registrado con exito."});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error en el Servidor."});
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                money: user.money,
                tokens: user.tokens,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error en el Servidor." });
    }
});

router.get("/me", verifyToken, async (req, res) => {
    console.log("Usuario autenticado ID:", req.user?.id);
    try {
        const user = await User.findById(req.user.id).select("-password");
        console.log("Usuario encontrado en la DB:", user);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        res.status(500).json({ message: "Error al obtener información del usuario" });
    }
});

router.put("/:username", async (req, res) => {
    const { username } = req.params;
    const updateData = req.body;
    console.log("Username recibido:", username);
    console.log("Datos para actualizar:", updateData);


    try {
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.delete("/delete-user", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta." });
        }
        
        const deleteUser = await User.findOneAndDelete({ username });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.status(200).json({ message: "Usuario eliminado con éxito.", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al eliminar el usuario." });
    }
});

module.exports = router;