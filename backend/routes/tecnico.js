import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Riego from "../models/Riego.js";
import Planta from "../models/Planta.js";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// 📸 Configuración de Multer para fotos de evidencia
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../uploads/riegos");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage });

/* ============================================================
   💧 POST - Usuario solicita riego
============================================================ */
router.post("/solicitar", async (req, res) => {
  try {
    const { requesterId, requesterName, treeId, treeName, location } = req.body;

    // Validación
    if (!requesterId || !treeId)
      return res.status(400).json({ msg: "Datos incompletos para crear solicitud." });

    // Buscar árbol
    const planta = await Planta.findById(treeId);
    if (!planta) return res.status(404).json({ msg: "Árbol no encontrado." });

    // Buscar usuario
    const usuario = await Usuario.findById(requesterId);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });

    // Verificar créditos
    const costoRiego = 10;
    if (usuario.puntostotales < costoRiego) {
      return res.status(400).json({
        msg: `No tienes créditos suficientes (${usuario.puntostotales}/${costoRiego}).`,
      });
    }

    // Descontar créditos
    usuario.puntostotales -= costoRiego;
    await usuario.save();

    // ✅ Crear solicitud de riego con imagen incluida
    const nuevaSolicitud = new Riego({
      treeId,
      treeName: planta.nombre, // nombre real del árbol
      treeImage: planta.imagen, // 👈 AQUÍ el truco
      latitud: planta.latitud,
      longitud: planta.longitud,
      location: planta.descripcion || location || "Ubicación no especificada",
      requesterId,
      requesterName,
      urgency: "medium",
      status: "assigned",
      requestDate: new Date(),
    });

    await nuevaSolicitud.save();

    res.json({
      msg: "💧 Solicitud de riego enviada con éxito",
      riego: nuevaSolicitud,
      creditosRestantes: usuario.puntostotales,
    });
  } catch (error) {
    console.error("❌ Error al crear solicitud:", error);
    res.status(500).json({ msg: "Error al crear solicitud de riego." });
  }
});


/* ============================================================
   🔍 GET - Ver solicitudes pendientes
============================================================ */
router.get("/pendientes", async (req, res) => {
  try {
    const tareas = await Riego.find({ status: { $ne: "completed" } }).sort({ requestDate: -1 });
    res.json(tareas);
  } catch (error) {
    console.error("❌ Error al obtener solicitudes:", error);
    res.status(500).json({ msg: "Error al obtener solicitudes de riego." });
  }
});

/* ============================================================
   🔧 PUT - Actualizar estado (in-progress / completed)
============================================================ */
router.put("/:id/estado", async (req, res) => {
  try {
    const { status, technicianId, technicianName } = req.body;
    const riego = await Riego.findById(req.params.id);
    if (!riego) return res.status(404).json({ msg: "Solicitud no encontrada." });

    riego.status = status;
    if (technicianId) riego.technicianId = technicianId;
    if (technicianName) riego.technicianName = technicianName;
    await riego.save();

    res.json({ msg: "✅ Estado actualizado correctamente", riego });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ msg: "Error al actualizar estado del riego." });
  }
});

/* ============================================================
   📸 POST - Reporte técnico final (con foto)
============================================================ */
router.post("/:id/reportar", upload.single("photoEvidence"), async (req, res) => {
  try {
    const {
      completionStatus,
      waterAmount,
      duration,
      treeCondition,
      notes,
      issues,
      recommendations,
      technicianId,
      technicianName,
    } = req.body;

    const riego = await Riego.findById(req.params.id);
    if (!riego) return res.status(404).json({ msg: "Solicitud no encontrada." });

    riego.completionStatus = completionStatus;
    riego.waterAmount = waterAmount;
    riego.duration = duration;
    riego.treeCondition = treeCondition;
    riego.notes = notes;
    riego.issues = issues;
    riego.recommendations = recommendations;
    riego.photoEvidence = req.file ? req.file.filename : riego.photoEvidence;
    riego.status = "completed";
    riego.technicianId = technicianId;
    riego.technicianName = technicianName;
    riego.completedAt = new Date();

    await riego.save();

    res.json({ msg: "✅ Reporte guardado exitosamente", riego });
  } catch (error) {
    console.error("❌ Error al guardar reporte de riego:", error);
    res.status(500).json({ msg: "Error al guardar reporte del riego." });
  }
});

/* ============================================================
   🔍 GET - Ver riegos completados
============================================================ */
router.get("/completados", async (req, res) => {
  try {
    const completados = await Riego.find({ status: "completed" }).sort({ completedAt: -1 });
    res.json(completados);
  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ msg: "Error al obtener historial de riegos." });
  }
});

export default router;
