import mongoose from "mongoose";

const EventoPlantaSchema = new mongoose.Schema({
  idplanta: { type: mongoose.Schema.Types.ObjectId, ref: "Planta", required: true },
  idusuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  tipo: { type: String, enum: ["adopcion", "riego"], required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  notas: String,
  comprobanteurl: String,
  costo: { type: Number, default: 0 }
});

export default mongoose.model("EventoPlanta", EventoPlantaSchema);
