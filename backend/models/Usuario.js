import mongoose from "mongoose";

const PerfilSchema = new mongoose.Schema({
  phone: String,
  city: String,
  neighborhood: String,
  birthDate: String,
  motivation: String
});

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: String,
  correo: { type: String, required: true, unique: true },
  contraseñahash: { type: String, required: true },
  fotoperfil: String,
  rol: { type: String, enum: ["Cliente", "Técnico", "Administrador"], default: "Cliente" },
  puntostotales: { type: Number, default: 0 },
  perfil: PerfilSchema,
  fechaRegistro: { type: Date, default: Date.now }
});

export default mongoose.model("Usuario", UsuarioSchema);
