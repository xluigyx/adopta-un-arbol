import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();

/* 
  ✅ Obtener un usuario por ID
  Ejemplo: GET http://localhost:3000/api/usuarios/68d88d289e51a68fbfef18db
*/
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

/* 
  ✅ Actualizar puntos totales (por ejemplo, tras aceptar un pago QR)
  Ejemplo: PUT http://localhost:3000/api/usuarios/actualizar-puntos/68d88d289e51a68fbfef18db
  Body: { "nuevosPuntos": 120 }
*/
router.put("/actualizar-puntos/:id", async (req, res) => {
  try {
    const { nuevosPuntos } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { puntostotales: nuevosPuntos },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("❌ Error al actualizar puntos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
