import express from "express";
import multer from "multer";
import Planta from "../models/Planta.js";

const router = express.Router();

// Configuración de multer para guardar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Obtener todas las plantas
router.get("/", async (req, res) => {
  try {
    const plantas = await Planta.find()
      .populate("cuidador", "nombre correo")
      .populate("adoptante", "nombre correo")
      .populate("categoria", "nombre");
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
      latitud: Number(latitud),
      longitud: Number(longitud),
      imagen: req.file ? req.file.filename : null,
    });

    await nuevaPlanta.save();

    res.status(201).json({ msg: "🌳 Árbol registrado con éxito", planta: nuevaPlanta });
  } catch (error) {
    console.error("❌ Error al registrar planta:", error);
    res.status(500).json({ msg: "Error al registrar planta" });
  }
});

export default router;
