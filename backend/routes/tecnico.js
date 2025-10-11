import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Riego from "../models/Riego.js";

const router = express.Router();

// 📸 Configuración de carpeta de uploads
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
   🌳 POST - Usuario solicita riego de un árbol
============================================================ */
router.post("/solicitar", async (req, res) => {
  try {
    const { treeId, requesterId, requesterName, location } = req.body;

    if (!treeId || !requesterId)
      return res.status(400).json({ msg: "Faltan datos de la solicitud" });

    // Verificar si ya existe una solicitud pendiente para ese árbol
    const existePendiente = await Riego.findOne({
      treeId,
      status: { $ne: "completed" },
    });

    if (existePendiente) {
      return res
        .status(400)
        .json({ msg: "Ya existe una solicitud de riego pendiente para este árbol" });
    }

    // Crear solicitud nueva
    const nuevaSolicitud = new Riego({
      treeId,
      treeName: req.body.treeName || "sin nombre",
      requesterId, // Se llenará en el frontend o con un populate si es necesario
      requesterName,
      location,
      urgency: "medium",
      status: "assigned",
      requestDate: new Date(),
    });

    await nuevaSolicitud.save();

    return res.json({
      success: true,
      msg: "✅ Solicitud de riego enviada correctamente",
      solicitud: nuevaSolicitud,
    });
  } catch (error) {
    console.error("❌ Error al crear solicitud de riego:", error);
    res.status(500).json({ msg: "Error al crear solicitud de riego" });
  }
});

/* ============================================================
   🔍 GET - Ver todas las solicitudes de riego pendientes
============================================================ */
router.get("/pendientes", async (req, res) => {
  try {
    const tareas = await Riego.find({ status: { $ne: "completed" } })
      .sort({ requestDate: -1 })
      .lean();

    const Planta = (await import("../models/Planta.js")).default;
    const plantas = await Planta.find();

    const tareasConImagen = tareas.map((t) => {
      const planta = plantas.find((p) => p._id.toString() === t.treeId?.toString());
      return {
        ...t,
        treeImage: planta?.imagen || null,
        location: planta
          ? `${planta.latitud}, ${planta.longitud}`
          : "Ubicación no disponible",
      };
    });

    res.json(tareasConImagen);
  } catch (error) {
    console.error("❌ Error al obtener solicitudes:", error);
    res.status(500).json({ msg: "Error al obtener solicitudes de riego" });
  }
});

/* ============================================================
   🔧 PUT - Actualizar estado del riego
============================================================ */
router.put("/:id/estado", async (req, res) => {
  try {
    const { status, technicianId, technicianName } = req.body;
    const riego = await Riego.findById(req.params.id);
    if (!riego)
      return res.status(404).json({ msg: "Solicitud de riego no encontrada" });

    riego.status = status;
    if (technicianId) riego.technicianId = technicianId;
    if (technicianName) riego.technicianName = technicianName;
    await riego.save();

    res.json({ msg: "✅ Estado actualizado correctamente", riego });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ msg: "Error al actualizar estado del riego" });
  }
});

/* ============================================================
   📸 POST - Enviar reporte final del riego (formulario técnico)
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
    if (!riego)
      return res.status(404).json({ msg: "Solicitud de riego no encontrada" });

    riego.completionStatus = completionStatus;
    riego.waterAmount = waterAmount;
    riego.duration = duration;
    riego.treeCondition = treeCondition;
    riego.notes = notes;
    riego.issues = issues;
    riego.recommendations = recommendations;
    riego.status = "completed";
    riego.technicianId = technicianId;
    riego.technicianName = technicianName;
    riego.completedAt = new Date();

    if (req.file) {
      riego.photoEvidence = req.file.filename;
    }

    await riego.save();

    res.json({ msg: "✅ Reporte de riego guardado exitosamente", riego });
  } catch (error) {
    console.error("❌ Error al guardar reporte de riego:", error);
    res.status(500).json({ msg: "Error al guardar reporte de riego" });
  }
});

/* ============================================================
   🔍 GET - Obtener todos los riegos completados (historial)
============================================================ */
router.get("/completados", async (req, res) => {
  try {
    const completados = await Riego.find({ status: "completed" }).sort({
      completedAt: -1,
    });
    res.json(completados);
  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ msg: "Error al obtener historial de riegos" });
  }
});

export default router;
