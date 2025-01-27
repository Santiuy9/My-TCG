// const express = require("express");
// const User = require("../models/User");
// const router = express.Router();

// router.get('/user/money', async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({message: "Usuario no encontrado"});
//         res.json({money: user.money});
//     }
//     catch(err) {
//         console.error(err);
//         res.status(500).json({message: "Error al obtener las Monedas"});
//     }
// });

// module.exports = router;