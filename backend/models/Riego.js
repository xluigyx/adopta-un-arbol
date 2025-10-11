import mongoose from "mongoose";

const RiegoSchema = new mongoose.Schema({
  // 🔹 Información del árbol
  treeId: { type: mongoose.Schema.Types.ObjectId, ref: "Planta", required: true },
  treeName: { type: String, required: true },
  treeImage: { type: String },  // 👈 para mostrar imagen en la vista del técnico
  latitud: { type: Number },
  longitud: { type: Number },
  location: { type: String },

  // 🔹 Solicitante
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  requesterName: { type: String },

  // 🔹 Técnico asignado
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  technicianName: { type: String },

  // 🔹 Estado y prioridad
  urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["assigned", "in-progress", "completed"], default: "assigned" },
  requestDate: { type: Date, default: Date.now },
  dueDate: { type: Date },

  // 🔹 Reporte técnico
  completionStatus: { type: String },
  waterAmount: { type: String },
  duration: { type: String },
  treeCondition: { type: String },
  notes: { type: String },
  issues: { type: String },
  recommendations: { type: String },
  photoEvidence: { type: String },
  completedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Riego", RiegoSchema);
