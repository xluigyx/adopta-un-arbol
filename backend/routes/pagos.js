import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Pago from "../models/Pago.js";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// 🧭 Obtener ruta absoluta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📸 Carpeta donde se guardarán los comprobantes (ruta absoluta segura)
const uploadPath = path.join(__dirname, "../uploads/comprobantes");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// ⚙️ Configuración de multer (subida de imágenes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📤 POST /api/pago — registrar un nuevo pago con comprobante
router.post("/", upload.single("comprobante"), async (req, res) => {
  try {
    const {
      userId,
      nombreUsuario,
      paqueteId,
      paqueteNombre,
      creditos,
      bonus,
      precio,
      notas,
    } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Falta el userId del usuario" });
    }

    // 📎 URL del comprobante
    const comprobanteUrl = req.file
      ? `/uploads/comprobantes/${req.file.filename}`
      : null;

    // 🧾 Crear nuevo registro de pago
    const nuevoPago = new Pago({
      userId,
      nombreUsuario,
      paquete: {
        id: paqueteId,
        nombre: paqueteNombre,
        creditos: Number(creditos),
        bonus: Number(bonus || 0),
        precio: Number(precio),
      },
      montoTotal: Number(precio),
      metodoPago: "QR Bolivia",
      comprobanteUrl,
      notas,
      estado: "Pendiente",
      fechaCreacion: new Date(),
    });

    await nuevoPago.save();

    console.log("✅ Pago registrado correctamente:", nuevoPago._id);
    res.status(201).json({
      success: true,
      message: "✅ Comprobante subido correctamente.",
      pago: nuevoPago,
    });
  } catch (error) {
    console.error("❌ Error al guardar pago:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al registrar el pago." });
  }
});

// 📥 GET /api/pago — listar todos los pagos (ordenados por fecha)
router.get("/", async (req, res) => {
  try {
    const pagos = await Pago.find().sort({ fechaCreacion: -1 });
    res.json({ success: true, pagos });
  } catch (error) {
    console.error("❌ Error al obtener pagos:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener pagos." });
  }
});

// 🔔 GET /api/pago/pending/count — contar pagos pendientes
router.get("/pending/count", async (req, res) => {
  try {
    const count = await Pago.countDocuments({ estado: "Pendiente" });
    res.json({ success: true, count });
  } catch (error) {
    console.error("❌ Error al contar pagos pendientes:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al contar pagos pendientes." });
  }
});

// ✅ PUT /api/pago/:id/estado — actualizar estado (Aprobado / Rechazado)
router.put("/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    const pago = await Pago.findById(req.params.id);

    if (!pago)
      return res
        .status(404)
        .json({ success: false, message: "Pago no encontrado" });

    pago.estado = estado;
    await pago.save();

    // Si se aprueba, sumamos créditos al usuario
    if (estado === "Aprobado") {
      const usuario = await Usuario.findById(pago.userId);
      if (usuario) {
        usuario.puntostotales +=
          pago.paquete.creditos + (pago.paquete.bonus || 0);
        await usuario.save();
      }
    }

    res.json({
      success: true,
      message: `Pago ${estado.toLowerCase()} correctamente`,
    });
  } catch (error) {
    console.error("❌ Error al actualizar pago:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar pago." });
  }
});

export default router;
