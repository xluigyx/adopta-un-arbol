import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  detalles: { type: String, default: "" }, // opcional si luego agregas alias/número de cuenta
  fechaSubida: { type: Date, default: Date.now }
});

export default mongoose.model("qrcodes", qrCodeSchema);
