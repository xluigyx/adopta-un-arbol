import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import plantaRoutes from "./routes/planta.js";
import pagoRoutes from "./routes/pagos.js";
import qrRoutes from "./routes/qr.js";
import usuarioRoutes from "./routes/usuario.js";
import tecnicoRoutes from "./routes/tecnico.js";
import settingsRouter from "./routes/settings.js";

dotenv.config();

const app = express();

// Paths absolutos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Archivos estáticos (imágenes, QR, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CORS (permite conexión desde el dominio del hosting)
app.use(cors({
  origin: [
    "http://localhost:5173", // desarrollo local
    "https://tudominio.monsterasp.net", // PRODUCCIÓN hosting
  ],
  credentials: true,
}));

app.use(express.json());

// ✅ Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/planta", plantaRoutes);
app.use("/api/pago", pagoRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tecnico", tecnicoRoutes);
app.use("/api/settings", settingsRouter);

// ✅ Conexión MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`🌱 Servidor backend activo en puerto ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error en MongoDB:", err));
