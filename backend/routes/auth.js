import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// ✅ REGISTRO
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      city,
      neighborhood,
      birthDate,
      motivation
    } = req.body;

    // Verificar si el correo ya existe
    const existe = await Usuario.findOne({ correo: email });
    if (existe)
      return res.status(400).json({ msg: "El correo ya está registrado" });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñahash = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre: firstName,
      apellido: lastName,
      correo: email,
      contraseñahash,
      rol: "Cliente",
      puntostotales: 10, // créditos de bienvenida
      fotoperfil: "",
      perfil: {
        phone,
        city,
        neighborhood,
        birthDate,
        motivation,
      },
    });

    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      msg: "Usuario registrado con éxito",
      usuario: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        puntostotales: nuevoUsuario.puntostotales,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Error en el registro" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo: email });
    if (!usuario)
      return res.status(404).json({ success: false, msg: "Usuario no encontrado" });

    // Comparar contraseña
    const esValido = await bcrypt.compare(password, usuario.contraseñahash);
    if (!esValido)
      return res.status(400).json({ success: false, msg: "Contraseña incorrecta" });

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "mi_secreto",
      { expiresIn: "1d" }
    );

    // Devolver respuesta con _id
    res.json({
      success: true,
      msg: "Login exitoso",
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        puntostotales: usuario.puntostotales,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Error en el login" });
  }
});

export default router;
