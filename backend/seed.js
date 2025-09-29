import mongoose from "mongoose";
import dotenv from "dotenv";

import Planta from "./models/Planta.js";
import EventoPlanta from "./models/EventoPlanta.js";
import Riego from "./models/Riego.js";
import Pago from "./models/Pago.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Arbolitos";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Limpiar datos anteriores de prueba
    await Planta.deleteMany({});
    await EventoPlanta.deleteMany({});
    await Riego.deleteMany({});
    await Pago.deleteMany({});

    // Insertar plantas
    const plantas = await Planta.insertMany([
      {
        nombre: "Roble del Parque",
        especie: "Quercus robur",
        descripcion: "Roble robusto ubicado en el parque central",
        estadoactual: "available",
        latitud: -17.3895,
        longitud: -66.1568,
        direccion: "Parque Central, Cochabamba",
        cuidador: "Municipio",
        imagen: "https://images.unsplash.com/photo-1605245136640-05b9ae766b06?w=800"
      },
      {
        nombre: "Jacarandá de la Avenida",
        especie: "Jacaranda mimosifolia",
        descripcion: "Árbol ornamental con flores lilas",
        estadoactual: "adopted",
        latitud: -17.392,
        longitud: -66.158,
        direccion: "Av. América, Cochabamba",
        cuidador: "Ana Rodríguez",
        adoptante: "Familia López",
        imagen: "https://images.unsplash.com/photo-1644676654534-abc4f62ceee1?w=800"
      },
      {
        nombre: "Sauce del Río",
        especie: "Salix babylonica",
        descripcion: "Sauce llorón junto al río Rocha",
        estadoactual: "maintenance",
        latitud: -17.401,
        longitud: -66.15,
        direccion: "Zona Sur, Cochabamba",
        cuidador: "Carlos Mendoza",
        imagen: "https://images.unsplash.com/photo-1526344966-89049886b28d?w=800"
      }
    ]);
    console.log("🌳 Plantas insertadas:", plantas.length);

    // Insertar eventos de adopción
    await EventoPlanta.insertMany([
      {
        idplanta: plantas[1]._id,
        idusuario: "000000000000000000000001", // reemplazar con un ObjectId válido de usuario cliente
        tipo: "adopcion",
        estado: "approved",
        notas: "Adopción realizada en feria ambiental"
      }
    ]);
    console.log("📜 Eventos de adopción insertados");

    // Insertar solicitudes de riego
    await Riego.insertMany([
      {
        userName: "Pedro Martínez",
        userEmail: "pedro@email.com",
        treeName: "Sauce del Río",
        location: "Zona Sur, Cochabamba",
        urgency: "high",
        notes: "El árbol se ve seco, necesita agua urgente",
        status: "pending"
      },
      {
        userName: "Lucía Torres",
        userEmail: "lucia@email.com",
        treeName: "Roble del Parque",
        location: "Parque Central, Cochabamba",
        urgency: "medium",
        notes: "Riego mensual programado",
        status: "pending"
      }
    ]);
    console.log("💧 Solicitudes de riego insertadas");

    // Insertar pagos
    await Pago.insertMany([
      {
        userName: "Carlos López",
        userEmail: "carlos@email.com",
        amount: 20,
        credits: 40,
        method: "Tarjeta",
        status: "approved"
      },
      {
        userName: "Ana Rodríguez",
        userEmail: "ana@email.com",
        amount: 15,
        credits: 30,
        method: "QR",
        status: "pending"
      }
    ]);
    console.log("💵 Pagos insertados");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  }
};

run();
