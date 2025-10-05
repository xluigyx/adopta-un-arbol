import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Pago from "../models/Pago.js";
import Usuario from "../models/Usuario.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📸 Carpeta donde se guardarán los comprobantes (si no existe, se crea)
const uploadPath = path.join(__dirname, "../uploads/comprobantes");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// ⚙️ Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 📤 POST /api/pago — registrar compra QR
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
      return res.status(400).json({ success: false, message: "Falta userId" });
    }

    // ✅ Ruta pública del comprobante
    const comprobanteUrl = req.file
      ? `/uploads/comprobantes/${req.file.filename}`
      : null;

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

    res
      .status(201)
      .json({ success: true, message: "✅ Comprobante subido correctamente." });
  } catch (error) {
    console.error("❌ Error al guardar pago:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al registrar el pago." });
  }
});

// 📥 GET /api/pago — listar todos los pagos
router.get("/", async (req, res) => {
  try {
    const pagos = await Pago.find().sort({ fechaCreacion: -1 });
    res.json({ success: true, pagos });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener pagos." });
  }
});

// ✅ PUT /api/pago/:id/estado — actualizar estado y sumar créditos si es aprobado
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

    // 🟢 Si se aprueba → sumar créditos al usuario
    if (estado === "Aprobado") {
      const usuario = await Usuario.findById(pago.userId);

      if (usuario) {
        const totalCreditos =
          (pago.paquete.creditos || 0) + (pago.paquete.bonus || 0);
        usuario.puntostotales = (usuario.puntostotales || 0) + totalCreditos;
        await usuario.save();

        console.log(
          `✅ Créditos añadidos al usuario ${usuario.nombre}: +${totalCreditos}`
        );
      } else {
        console.warn("⚠️ Usuario no encontrado para este pago:", pago.userId);
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
      .json({ success: false, message: "Error al actualizar pago" });
  }
});

export default router;
