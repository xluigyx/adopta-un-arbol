import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// 🔹 Solicitar recuperación
router.post("/recover", async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ correo: email });

    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Crear token válido 15 minutos
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || "mi_secreto",
      { expiresIn: "15m" }
    );

    // Para demo: devolvemos el link (en producción se envía por correo)
    const link = `http://localhost:3000/reset-password?token=${token}`;

    res.json({
      msg: "Se generó un link de recuperación",
      link,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al solicitar recuperación" });
  }
});

// 🔹 Resetear contraseña
router.post("/reset", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mi_secreto");
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Guardar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.contraseñahash = await bcrypt.hash(newPassword, salt);
    await usuario.save();

    res.json({ msg: "Contraseña actualizada con éxito ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Token inválido o expirado" });
  }
});

export default router;
