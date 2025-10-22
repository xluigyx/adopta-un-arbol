import mongoose from "mongoose";

const CreditPackageSchema = new mongoose.Schema({
  id: { type: String, required: true },       // slug único: "starter", "family", etc.
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  bonus: { type: Number, default: 0 },
  popular: { type: Boolean, default: false },
  description: { type: String, default: "" },
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
  adoptionPrice: { type: Number, default: 35 }, // costo para adoptar 1 árbol
  waterPrice: { type: Number, default: 10 },    // costo por cada riego solicitado
  currency: { type: String, default: "Bs" },
  creditPackages: { type: [CreditPackageSchema], default: [] },
}, { timestamps: true });

export default mongoose.model("Settings", SettingsSchema);
