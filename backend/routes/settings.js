import express from "express";
import Settings from "../models/Settings.js";

const router = express.Router();

// Obtiene (o crea si no existe) la configuración
router.get("/", async (_req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) {
      s = await Settings.create({
        adoptionPrice: 35,
        waterPrice: 10,
        currency: "Bs",
        creditPackages: [
          { id:"starter", name:"Paquete Inicial", credits:10, price:35, description:"Perfecto para adoptar tu primer árbol"},
          { id:"family", name:"Paquete Familiar", credits:25, price:80, originalPrice:100, bonus:3, description:"Ideal para familias comprometidas con el ambiente"},
          { id:"community", name:"Paquete Comunidad", credits:50, price:125, originalPrice:160, popular:true, bonus:8, description:"Para comunidades que quieren hacer un gran impacto"},
          { id:"enterprise", name:"Paquete Empresa", credits:100, price:200, originalPrice:300, bonus:20, description:"Para empresas con responsabilidad social"},
        ],
      });
    }
    res.json({ success: true, settings: s });
  } catch (e) {
    console.error("❌ GET /settings:", e);
    res.status(500).json({ success:false, msg:"Error obteniendo configuración" });
  }
});

// Actualiza configuración completa (admin)
router.put("/", async (req, res) => {
  try {
    const { adoptionPrice, waterPrice, currency, creditPackages } = req.body;
    const update = {};
    if (adoptionPrice !== undefined) update.adoptionPrice = Number(adoptionPrice);
    if (waterPrice   !== undefined) update.waterPrice   = Number(waterPrice);
    if (currency     !== undefined) update.currency     = String(currency);
    if (creditPackages !== undefined) update.creditPackages = creditPackages;

    const s = await Settings.findOneAndUpdate({}, update, { new:true, upsert:true });
    res.json({ success:true, settings:s });
  } catch (e) {
    console.error("❌ PUT /settings:", e);
    res.status(500).json({ success:false, msg:"Error guardando configuración" });
  }
});

export default router;
