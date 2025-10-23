// src/utils/settings.ts
export type PricePackage = {
  id: string;
  name: string;
  credits: number;
  price: number; // Bs
  bonus?: number;
  description?: string;
};

export interface AppSettings {
  costs: {
    adoptCost: number;     // costo (créditos) para adoptar
    wateringCost: number;  // costo (créditos) para riego
  };
  packages: PricePackage[]; // paquetes de compra de créditos (Bs)
}

export const SETTINGS_KEY = "app_settings_v1";

export const DEFAULT_SETTINGS: AppSettings = {
  costs: { adoptCost: 35, wateringCost: 10 },
  packages: [
    { id: "starter",    name: "Paquete Inicial",   credits: 10,  price: 35 },
    { id: "family",     name: "Paquete Familiar",  credits: 25,  price: 80,  bonus: 3 },
    { id: "community",  name: "Paquete Comunidad", credits: 50,  price: 125, bonus: 8 },
    { id: "enterprise", name: "Paquete Empresa",   credits: 100, price: 200, bonus: 20 },
  ],
};

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      costs: {
        adoptCost: parsed?.costs?.adoptCost ?? DEFAULT_SETTINGS.costs.adoptCost,
        wateringCost: parsed?.costs?.wateringCost ?? DEFAULT_SETTINGS.costs.wateringCost,
      },
      packages: Array.isArray(parsed?.packages) && parsed.packages.length
        ? parsed.packages
        : DEFAULT_SETTINGS.packages,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  // notificación para otras pestañas/componentes
  window.dispatchEvent(
    new StorageEvent("storage", { key: SETTINGS_KEY, newValue: JSON.stringify(s) })
  );
}

export function resetSettings() {
  localStorage.removeItem(SETTINGS_KEY);
  saveSettings(DEFAULT_SETTINGS);
}
