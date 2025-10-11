import mongoose from "mongoose";

const RiegoSchema = new mongoose.Schema({
  treeId: { type: mongoose.Schema.Types.ObjectId, ref: "Planta", required: true },
  treeName: { type: String, required: true },
  location: { type: String },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  requesterName: { type: String },

  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  technicianName: { type: String },

  urgency: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["assigned", "in-progress", "completed"],
    default: "assigned",
  },

  // 🔔 nuevo campo para controlar si el usuario ya fue notificado
  notificado: { type: Boolean, default: false },

  // Reporte técnico
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
