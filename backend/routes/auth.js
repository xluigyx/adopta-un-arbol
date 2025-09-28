import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// ✅ REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, city, neighborhood, birthDate, motivation } = req.body;

    // Verificar si el correo ya existe
    const existe = await Usuario.findOne({ correo: email });
    if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñahash = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre: firstName,
      apellido: lastName,
      correo: email,
      contraseñahash,
      rol: "Cliente",         // siempre cliente al registrarse
      puntostotales: 10,      // créditos de bienvenida
      fotoperfil: "",
      perfil: {
        phone,
        city,
        neighborhood,
        birthDate,
        motivation
      }
    });

    await nuevoUsuario.save();

    res.status(201).json({
      msg: "Usuario registrado con éxito",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el registro" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo: email });
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Comparar contraseña
    const esValido = await bcrypt.compare(password, usuario.contraseñahash);
    if (!esValido) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "mi_secreto",
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el login" });
  }
});

export default router;
