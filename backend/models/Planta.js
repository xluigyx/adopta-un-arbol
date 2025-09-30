import mongoose from "mongoose";

const PlantaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  descripcion: String,
  codigo: {
    type: String,
    unique: true,
    default: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
  },
  estadoactual: {
    type: String,
    enum: ["available", "adopted", "maintenance"],
    default: "available",
  },
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true },
  direccion: String,
  fechaPlantacion: { type: Date, default: Date.now },
  cuidador: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  adoptante: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  imagen: String,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "CategoriaPlanta" },
});

export default mongoose.model("Planta", PlantaSchema);
