import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import QrCode from "../models/QrCode.js";

const router = express.Router();

// 🔹 Asegurar que la carpeta exista (ruta absoluta)
const __dirname = path.resolve();
const qrPath = path.join(__dirname, "backend", "uploads", "qr");
if (!fs.existsSync(qrPath)) {
  fs.mkdirSync(qrPath, { recursive: true });
  console.log("📂 Carpeta creada:", qrPath);
}

// 🔹 Configurar almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, qrPath),
  filename: (req, file, cb) => {
    const uniqueName = `qr_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 🔹 POST /api/qr – subir nuevo QR
router.post("/", upload.single("qrImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No se recibió ningún archivo" });
    }

    const qrUrl = `/uploads/qr/${req.file.filename}`;

    // Eliminar QR anterior (solo mantenemos uno)
    await QrCode.deleteMany({});

    const nuevoQR = new QrCode({ imageUrl: qrUrl });
    await nuevoQR.save();

    res.status(201).json({ success: true, imageUrl: qrUrl });
  } catch (error) {
    console.error("❌ Error al subir QR:", error);
    res.status(500).json({ success: false, message: "Error al subir QR" });
  }
});

// 🔹 GET /api/qr – obtener el QR actual
router.get("/", async (req, res) => {
  try {
    const qr = await QrCode.findOne().sort({ fechaSubida: -1 });
    if (!qr) return res.json({ success: false, message: "No hay QR disponible" });
    res.json({ success: true, imageUrl: qr.imageUrl });
  } catch (error) {
    console.error("❌ Error al obtener QR:", error);
    res.status(500).json({ success: false, message: "Error al obtener QR" });
  }
});

export default router;
