import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Arbolitos")
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(4000, () => console.log("🌱 Servidor backend en http://localhost:4000"));
  })
  .catch((err) => console.error("❌ Error en MongoDB:", err));
