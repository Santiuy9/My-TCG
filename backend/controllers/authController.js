const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExist = await User.findOne({ username });
        const emailExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "El Usuario ya está en uso." });
        if (emailExist) return res.status(400).json({ message: "El Email ya está en uso." });

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error en el Servidor." });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta." });

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
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        res.status(500).json({ message: "Error al obtener información del usuario." });
    }
};

const updateUser = async (req, res) => {
    const { username } = req.params;
    const { currentPassword, newPassword, username: newUsername, ...updateFields } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta." });

        if (newUsername) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "El nombre de usuario ya está en uso. Por favor, elige otro." });
            }
            updateFields.username = newUsername;
        }

        if (newPassword) {
            const salt = await bcryptjs.genSalt(10);
            updateFields.password = await bcryptjs.hash(newPassword, salt);
        }

        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Usuario actualizado correctamente", user: updatedUser });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({ message: "Se requiere la contraseña actual." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Usuario eliminado correctamente." });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

module.exports = { register, login, getMe, updateUser, deleteUser };