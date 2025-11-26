import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Riego from "../models/Riego.js";
import Settings from "../models/Settings.js";
import Usuario from "../models/Usuario.js"; // asegúrate que la ruta es correcta

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
   💸 PUT - Marcar pago del riego (Admin)
============================================================ */
router.put("/:id/pago", async (req, res) => {
  try {
    const { id } = req.params;

    const riego = await Riego.findById(id);
    if (!riego)
      return res.status(404).json({ msg: "Solicitud de riego no encontrada" });

    riego.pago = "pagado";  // MARCAR COMO PAGADO
    await riego.save();

    res.json({ msg: "💰 Pago registrado correctamente", riego });
  } catch (error) {
    console.error("❌ Error al registrar pago:", error);
    res.status(500).json({ msg: "Error al registrar pago" });
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
    if (!riego) return res.status(404).json({ msg: "Solicitud de riego no encontrada" });

    // Guardar reporte
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
    if (req.file) riego.photoEvidence = req.file.filename;
    await riego.save();

    // 🔻 Descontar créditos del solicitante según Settings.waterPrice
    try {
      const settings = (await Settings.findOne()) || { waterPrice: 10 };
      const costoRiego = Number(settings.waterPrice ?? 10);
      if (riego.requesterId && costoRiego > 0) {
        const user = await Usuario.findById(riego.requesterId);
        if (user) {
          const actual = Number(user.puntostotales ?? user.credits ?? 0);
          const nuevo  = Math.max(0, actual - costoRiego);
          user.puntostotales = nuevo;
          user.credits = nuevo; // si también usas "credits" en el front
          await user.save();
        }
      }
    } catch (descErr) {
      console.error("⚠️ No se pudo descontar créditos:", descErr);
    }

    res.json({ msg: "✅ Reporte de riego guardado exitosamente", riego });
  } catch (error) {
    console.error("❌ Error al guardar reporte de riego:", error);
    res.status(500).json({ msg: "Error al guardar reporte de riego" });
  }
});

/* ============================================================
   🔔 GET - Notificaciones de riegos completados (para usuario)
============================================================ */
router.get("/notificaciones/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar riegos completados que aún no se notificaron al usuario
    const nuevos = await Riego.find({
      requesterId: userId,
      status: "completed",
      notificado: false,
    });

    if (nuevos.length === 0) {
      return res.json({ success: true, nuevas: [] });
    }

    // Marcar como notificados
    await Riego.updateMany(
      { _id: { $in: nuevos.map((r) => r._id) } },
      { $set: { notificado: true } }
    );

    res.json({ success: true, nuevas: nuevos });
  } catch (error) {
    console.error("❌ Error al obtener notificaciones:", error);
    res.status(500).json({ msg: "Error al obtener notificaciones" });
  }
});

/* ============================================================
   🕒 GET - Historial de riegos completados del usuario (UserProfile)
============================================================ */
router.get("/historial/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar todos los árboles adoptados por el usuario
    const Planta = (await import("../models/Planta.js")).default;
    const plantas = await Planta.find({ adoptante: userId });
    const ids = plantas.map((p) => p._id.toString());

    // Buscar riegos completados de esos árboles
    const Riego = (await import("../models/Riego.js")).default;
    const riegos = await Riego.find({
      treeId: { $in: ids },
      status: "completed",
    })
      .sort({ completedAt: -1 })
      .lean();

    res.json(riegos);
  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ msg: "Error al obtener historial de riegos" });
  }
});

/* ============================================================
   🔔 GET - Notificaciones nuevas de riegos completados (UserProfile)
============================================================ */
router.get("/notificaciones/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar árboles adoptados por este usuario
    const Planta = (await import("../models/Planta.js")).default;
    const plantas = await Planta.find({ adoptante: userId });
    const ids = plantas.map((p) => p._id.toString());

    // Buscar riegos completados no notificados
    const Riego = (await import("../models/Riego.js")).default;
    const nuevos = await Riego.find({
      treeId: { $in: ids },
      status: "completed",
      notificado: false,
    });

    // Si hay nuevos, marcarlos como notificados
    if (nuevos.length > 0) {
      await Riego.updateMany(
        { _id: { $in: nuevos.map((r) => r._id) } },
        { $set: { notificado: true } }
      );
    }

    res.json({ success: true, nuevas: nuevos });
  } catch (error) {
    console.error("❌ Error al obtener notificaciones:", error);
    res.status(500).json({ msg: "Error al obtener notificaciones de riegos" });
  }
});
// 🔍 Obtener todos los riegos (pendientes + completados)
router.get("/todos", async (req, res) => {
  try {
    const riegos = await Riego.find().sort({ createdAt: -1 });
    res.json(riegos);
  } catch (error) {
    console.error("❌ Error al obtener todos los riegos:", error);
    res.status(500).json({ msg: "Error al obtener los riegos" });
  }
});

// ============================================================
// 🔍 GET - Obtener todos los riegos completados (historial)
// Soporta filtro por técnico: /api/tecnico/completados?technicianId=XXXXX
// ============================================================
router.get("/completados", async (req, res) => {
  try {
    const { technicianId } = req.query;

    const filtro = { status: "completed" };
    if (technicianId) {
      // Si guardas technicianId como ObjectId en el schema, no hace falta castear;
      // si lo guardaste como string, igual funciona. Mongo compara por valor.
      filtro.technicianId = technicianId;
    }

    const completados = await Riego.find(filtro).sort({ completedAt: -1 });
    res.json(completados);
  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ msg: "Error al obtener historial de riegos" });
  }
});

// GET /api/tecnico/historial-usuario/:userId
router.get("/historial-usuario/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 1) Por requesterId (quien pidió el riego)
    const porRequester = await Riego.find({
      requesterId: userId,
      status: "completed",
    }).lean();

    // 2) Por árboles adoptados (fallback/extra)
    const Planta = (await import("../models/Planta.js")).default;
    const plantas = await Planta.find({ adoptante: userId }).select("_id").lean();
    const ids = plantas.map((p) => p._id);

    const porArbol = await Riego.find({
      treeId: { $in: ids },   // si treeId es ObjectId, Mongoose castea
      status: "completed",
    }).lean();

    // Unión simple por _id
    const mapa = new Map();
    [...porRequester, ...porArbol].forEach((r) => mapa.set(String(r._id), r));
    const riegos = Array.from(mapa.values()).sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
    );

    res.json(riegos);
  } catch (error) {
    console.error("❌ Error en historial-usuario:", error);
    res.status(500).json({ msg: "Error al obtener historial de riegos" });
  }
});


export default router;
