import express from "express";
import Riego from "../models/Riego.js";
import Planta from "../models/Planta.js";
import EventoPlanta from "../models/EventoPlanta.js";

const router = express.Router();

// ✅ Obtener solicitudes de riego asignadas al técnico
router.get("/riegos/:tecnicoId", async (req, res) => {
  try {
    const { tecnicoId } = req.params;
    const riegos = await Riego.find({ assignedTechnician: tecnicoId });
    res.json(riegos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener solicitudes de riego" });
  }
});

// ✅ Marcar riego en progreso / completado
router.put("/riegos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const updated = await Riego.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar riego" });
  }
});

// ✅ Obtener árboles asignados al técnico
router.get("/arboles/:tecnicoId", async (req, res) => {
  try {
    const { tecnicoId } = req.params;
    const arboles = await Planta.find({ cuidador: tecnicoId });
    res.json(arboles);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener árboles asignados" });
  }
});

// ✅ Crear reporte de mantenimiento
router.post("/reportes", async (req, res) => {
  try {
    const { idplanta, idusuario, estado, notas, proximaAccion } = req.body;
    const reporte = new EventoPlanta({
      idplanta,
      idusuario,
      tipo: "riego",
      estado,
      notas,
      costo: 0
    });
    await reporte.save();
    res.status(201).json(reporte);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear reporte" });
  }
});

export default router;
