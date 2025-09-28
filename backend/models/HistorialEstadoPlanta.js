import mongoose from "mongoose";

const HistorialEstadoPlantaSchema = new mongoose.Schema({
  idplanta: { type: mongoose.Schema.Types.ObjectId, ref: "Planta", required: true },
  estado: { type: String, enum: ["available", "adopted", "maintenance"], required: true },
  fechacambio: { type: Date, default: Date.now }
});

export default mongoose.model("HistorialEstadoPlanta", HistorialEstadoPlantaSchema);
