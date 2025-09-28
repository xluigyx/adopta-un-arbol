import mongoose from "mongoose";

const PagoSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  amount: Number,
  credits: Number,
  method: { type: String, enum: ["Tarjeta", "PayPal", "QR"], default: "QR" },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
});

export default mongoose.model("Pago", PagoSchema);
