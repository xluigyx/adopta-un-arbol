// backend/seed.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Usuario from "./models/Usuario.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Arbolitos");
    console.log("✅ Conectado a MongoDB");

    // Generar hashes
    const adminPass = await bcrypt.hash("admin123", 10);
    const tecnicoPass = await bcrypt.hash("admin12323", 10);

    // Crear usuarios
    await Usuario.create([
      {
        nombre: "Admin",
        apellido: "General",
        correo: "kanikaswe69@gmail.com",
        contraseñahash: adminPass,
        rol: "Administrador",
        puntostotales: 0,
        perfil: {
          phone: "+591 72456789",
          city: "Cochabamba",
          neighborhood: "Universidad",
          birthDate: "1990-01-01",
          motivation: "Soy el administrador del sistema"
        }
      },
      {
        nombre: "Juan",
        apellido: "Técnico",
        correo: "gptc7004@gmail.com",
        contraseñahash: tecnicoPass,
        rol: "Técnico",
        puntostotales: 0,
        perfil: {
          phone: "+591 71634790",
          city: "Cochabamba",
          neighborhood: "Zona Técnica",
          birthDate: "1995-05-10",
          motivation: "Encargado de mantenimiento"
        }
      }
    ]);

    console.log("🌱 Usuarios admin y técnico creados con éxito ✅");
    process.exit();
  } catch (err) {
    console.error("❌ Error al crear usuarios:", err);
    process.exit(1);
  }
};

run();
