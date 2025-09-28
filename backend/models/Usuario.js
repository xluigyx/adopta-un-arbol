import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: String,
  correo: { type: String, required: true, unique: true },
  contraseñahash: { type: String, required: true },
  fotoperfil: String,
  rol: { type: String, enum: ["Administrador", "Técnico", "Cliente"], default: "Cliente" },
  puntostotales: { type: Number, default: 0 },
  perfil: {
    phone: String,
    city: String,
    neighborhood: String,
    birthDate: String,
    motivation: String
  }
});

export default mongoose.model("Usuario", usuarioSchema);
