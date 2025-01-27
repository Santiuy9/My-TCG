const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error(err));

const cardRoutes = require("./routes/cards");
const authRoutes = require("./routes/auth");
const deckRoutes = require("./routes/deck");
const productRoutes = require("./routes/store");

app.use("/api/cards", cardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", deckRoutes);
app.use("/api/store", productRoutes);


app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))