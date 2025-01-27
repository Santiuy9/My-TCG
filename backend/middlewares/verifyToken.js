const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Acceso denegado" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } 
    catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(400).json({ message: "Token inválido" });
    }
};

module.exports = { verifyToken }