import express from "express";
import Planta from "../models/Planta.js";

const router = express.Router();

// ✅ Obtener todas las plantas
router.get("/", async (req, res) => {
  try {
    const plantas = await Planta.find()
      .populate("cuidador", "nombre correo")
      .populate("adoptante", "nombre correo")
      .populate("categoria", "nombre");
    res.json(plantas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener plantas" });
  }
});

// ✅ Crear nueva planta
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      especie,
      descripcion,
      codigo,
      estadoactual,
      latitud,
      longitud,
      direccion,
      cuidador,
      adoptante,
      imagen,
      categoria
    } = req.body;

    const nuevaPlanta = new Planta({
      nombre,
      especie,
      descripcion,
      codigo,
      estadoactual,
      latitud,
      longitud,
      direccion,
      cuidador,
      adoptante,
      imagen,
      categoria
    });

    await nuevaPlanta.save();

    res.status(201).json({ msg: "Árbol registrado con éxito", planta: nuevaPlanta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar árbol" });
  }
});

export default router;
