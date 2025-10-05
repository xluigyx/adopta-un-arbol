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

/* =======================================
   ✅ OBTENER TODAS LAS PLANTAS
======================================= */
router.get("/", async (req, res) => {
  try {
    const plantas = await Planta.find();
    res.json(plantas);
  } catch (error) {
    console.error("❌ Error al obtener plantas:", error);
    res.status(500).json({ msg: "Error al obtener plantas" });
  }
});

/* =======================================
   ✅ CREAR NUEVA PLANTA CON IMAGEN
======================================= */
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, especie, descripcion, estadoactual, latitud, longitud } =
      req.body;

    const nuevaPlanta = new Planta({
      nombre,
      especie,
      descripcion,
      estadoactual,
      latitud,
      longitud,
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

/* =======================================
   ✅ ADOPTAR UN ÁRBOL (RESTA CRÉDITO)
======================================= */
router.patch("/adopt/:id", async (req, res) => {
  try {
    const { usuarioId } = req.body;
    console.log("📥 PATCH /api/planta/adopt:", req.params.id, usuarioId);

    if (!usuarioId) {
      return res.status(400).json({ msg: "Falta el ID del usuario" });
    }

    const planta = await Planta.findById(req.params.id);
    if (!planta) {
      return res.status(404).json({ msg: "Árbol no encontrado" });
    }

    if (planta.estadoactual !== "available") {
      return res
        .status(400)
        .json({ msg: "El árbol no está disponible para adopción" });
    }

    // Buscar usuario y verificar créditos
    const Usuario = (await import("../models/Usuario.js")).default;
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (usuario.puntostotales < 1) {
      return res
        .status(400)
        .json({ msg: "No tienes créditos suficientes para adoptar un árbol" });
    }

    // Actualizar planta y usuario
    planta.estadoactual = "adopted";
    planta.adoptante = usuario._id;
    await planta.save();

    usuario.puntostotales -= 1; // 🔹 restamos un crédito
    await usuario.save();

    res.json({
      msg: "🌳 Árbol adoptado con éxito",
      planta,
      creditosRestantes: usuario.puntostotales,
    });
  } catch (error) {
    console.error("❌ Error al adoptar árbol:", error);
    res.status(500).json({ msg: "Error al adoptar el árbol" });
  }
});

export default router;
