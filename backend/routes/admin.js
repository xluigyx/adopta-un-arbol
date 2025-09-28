import express from "express";
import Usuario from "../models/Usuario.js";
import EventoPlanta from "../models/EventoPlanta.js"; // si lo tienes creado
import Pago from "../models/Pago.js"; // si tienes coleccion de pagos

const router = express.Router();

// Usuarios
router.get("/users", async (req, res) => {
  try {
    const users = await Usuario.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo usuarios" });
  }
});

// Solicitudes de adopción (ejemplo)
router.get("/adoption-requests", async (req, res) => {
  try {
    const requests = await EventoPlanta.find({ tipo: "adopcion" });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo solicitudes" });
  }
});

// Pagos
router.get("/payments", async (req, res) => {
  try {
    const pagos = await Pago.find();
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo pagos" });
  }
});

export default router;
