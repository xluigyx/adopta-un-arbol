import mongoose from "mongoose";

const PlantaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especie: String,
  descripcion: String,
  codigo: { type: String, unique: true },
  estadoactual: { type: String, enum: ["available", "adopted", "maintenance"], default: "available" },
  latitud: Number,
  longitud: Number,
  direccion: String,
  fechaPlantacion: { type: Date, default: Date.now },
  cuidador: String,
  adoptante: String,
  imagen: String
});

export default mongoose.model("Planta", PlantaSchema);
