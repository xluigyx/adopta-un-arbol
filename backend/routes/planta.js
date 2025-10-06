import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Planta from "../models/Planta.js";

const router = express.Router();

// Obtener __dirname porque estamos en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📸 Carpeta donde se guardan imágenes
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// ⚙️ Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

/* ======================================================
   📍 1️⃣ Obtener todas las plantas
====================================================== */
router.get("/", async (req, res) => {
  try {
    const plantas = await Planta.find();
    res.json(plantas);
  } catch (error) {
    console.error("❌ Error al obtener plantas:", error);
    res.status(500).json({ msg: "Error al obtener plantas" });
  }
});

/* ======================================================
   🌱 2️⃣ Crear nueva planta (solo admin)
====================================================== */
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const {
      nombre,
      especie,
      descripcion,
      estadoactual,
      latitud,
      longitud,
      costoAdopcion,
    } = req.body;

    const nuevaPlanta = new Planta({
      nombre,
      especie,
      descripcion,
      estadoactual: estadoactual || "available",
      latitud,
      longitud,
      costoAdopcion: costoAdopcion || 35, // 💰 por defecto 35 créditos
      imagen: req.file ? req.file.filename : null,
    });

    await nuevaPlanta.save();

    res.status(201).json({
      msg: "🌳 Árbol registrado con éxito",
      planta: nuevaPlanta,
    });
  } catch (error) {
    console.error("❌ Error al registrar planta:", error);
    res.status(500).json({ msg: "Error al registrar árbol" });
  }
});

/* ======================================================
   ✏️ 3️⃣ Editar planta (solo admin)
====================================================== */
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const {
      nombre,
      especie,
      descripcion,
      estadoactual,
      latitud,
      longitud,
      costoAdopcion,
    } = req.body;

    const updateData = {
      nombre,
      especie,
      descripcion,
      estadoactual,
      latitud,
      longitud,
      costoAdopcion,
    };

    if (req.file) {
      updateData.imagen = req.file.filename;
    }

    const plantaActualizada = await Planta.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!plantaActualizada) {
      return res.status(404).json({ msg: "Planta no encontrada" });
    }

    res.json({ msg: "✅ Árbol actualizado con éxito", planta: plantaActualizada });
  } catch (error) {
    console.error("❌ Error al actualizar planta:", error);
    res.status(500).json({ msg: "Error al actualizar árbol" });
  }
});

/* ======================================================
   🗑️ 4️⃣ Eliminar planta (solo admin)
====================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const plantaEliminada = await Planta.findByIdAndDelete(req.params.id);
    if (!plantaEliminada) {
      return res.status(404).json({ msg: "Árbol no encontrado" });
    }
    res.json({ msg: "🗑️ Árbol eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar árbol:", error);
    res.status(500).json({ msg: "Error al eliminar árbol" });
  }
});

/* ======================================================
   💚 5️⃣ Adoptar un árbol
====================================================== */
router.patch("/adopt/:id", async (req, res) => {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ msg: "Falta el ID del usuario" });
    }

    const planta = await Planta.findById(req.params.id);
    if (!planta) {
      return res.status(404).json({ msg: "Árbol no encontrado" });
    }

    if (planta.estadoactual !== "available") {
      return res.status(400).json({ msg: "El árbol ya fue adoptado o está en mantenimiento" });
    }

    // 🔹 Buscar al usuario
    const Usuario = (await import("../models/Usuario.js")).default;
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // 💰 Validar créditos suficientes
    const costo = planta.costoAdopcion || 35;
    if ((usuario.puntostotales || 0) < costo) {
      return res.status(400).json({
        msg: `No tienes créditos suficientes (${usuario.puntostotales}/${costo}). Recarga para adoptar este árbol.`,
        costoAdopcion: costo,
        creditosUsuario: usuario.puntostotales,
      });
    }

    // ✅ Restar créditos y adoptar
    usuario.puntostotales -= costo;
    await usuario.save();

    planta.estadoactual = "adopted";
    planta.adoptante = usuario._id;
    await planta.save();

    res.json({
      msg: `🌳 Árbol adoptado con éxito. Se descontaron ${costo} créditos.`,
      planta,
      creditosRestantes: usuario.puntostotales,
    });
  } catch (error) {
    console.error("❌ Error al adoptar árbol:", error);
    res.status(500).json({ msg: "Error al adoptar el árbol" });
  }
});

export default router;
