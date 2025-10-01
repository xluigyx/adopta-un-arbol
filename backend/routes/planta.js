import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Planta from "../models/Planta.js";

const router = express.Router();

// Obtener __dirname (porque estamos en ESModules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 Configuración de multer para guardar imágenes en backend/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Obtener todas las plantas
router.get("/", async (req, res) => {
  try {
    const plantas = await Planta.find();
    res.json(plantas);
  } catch (error) {
    console.error("❌ Error al obtener plantas:", error);
    res.status(500).json({ msg: "Error al obtener plantas" });
  }
});

// ✅ Crear nueva planta con imagen
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const {
      nombre,
      especie,
      descripcion,
      estadoactual,
      latitud,
      longitud,
    } = req.body;

    const nuevaPlanta = new Planta({
      nombre,
      especie,
      descripcion,
      estadoactual,
      latitud,
      longitud,
      // 🔹 Guardamos solo el nombre del archivo
      imagen: req.file ? req.file.filename : null,
    });

    await nuevaPlanta.save();

    res.status(201).json({
      msg: "Árbol registrado con éxito 🌳",
      planta: nuevaPlanta,
    });
  } catch (error) {
    console.error("❌ Error al registrar planta:", error);
    res.status(500).json({ msg: "Error al registrar árbol" });
  }
});

export default router;
