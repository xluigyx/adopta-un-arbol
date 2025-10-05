import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  nombreUsuario: String,
  paquete: {
    id: String,
    nombre: String,
    creditos: Number,
    bonus: Number,
    precio: Number,
  },
  montoTotal: Number,
  metodoPago: String,
  comprobanteUrl: String,
  notas: String,
  estado: {
    type: String,
    enum: ["Pendiente", "Aprobado", "Rechazado"],
    default: "Pendiente",
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Pago", pagoSchema);
