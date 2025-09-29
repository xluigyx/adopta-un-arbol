import mongoose from "mongoose";

const PlantaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  descripcion: String,
  codigo: { type: String, unique: true },
  estadoactual: { 
    type: String, 
    enum: ["available", "adopted", "maintenance"], 
    default: "available" 
  },
  latitud: Number,
  longitud: Number,
  direccion: String,
  fechaPlantacion: { type: Date, default: Date.now },
  cuidador: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  adoptante: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  imagen: String,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "CategoriaPlanta" }
});

export default mongoose.model("Planta", PlantaSchema);
