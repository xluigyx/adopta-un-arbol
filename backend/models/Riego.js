import mongoose from "mongoose";

const RiegoSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  treeName: String,
  location: String,
  urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  notes: String,
  status: { type: String, enum: ["pending", "assigned", "completed"], default: "pending" },
  assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  requestDate: { type: Date, default: Date.now }
});

export default mongoose.model("Riego", RiegoSchema);
