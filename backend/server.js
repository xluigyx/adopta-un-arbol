import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import tecnicoRoutes from "./routes/tecnico.js";
import plantaRoutes from "./routes/planta.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tecnico", tecnicoRoutes);
app.use("/api/planta", plantaRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Arbolitos")
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(4000, () => console.log("🌱 Servidor backend en http://localhost:4000"));
  })
  .catch((err) => console.error("❌ Error en MongoDB:", err));
