"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

// Helpers locales (sin backend)
const SETTINGS_KEY = "app_settings_v1";
type CreditPackage = { id: string; name: string; credits: number; price: number; bonus?: number; description?: string; };
type Settings = { ADOPT_COST: number; WATER_COST: number; packages: CreditPackage[] };

const DEFAULTS: Settings = {
  ADOPT_COST: 35,
  WATER_COST: 10,
  packages: [
    { id: "starter", name: "Paquete Inicial", credits: 10, price: 35, description: "Perfecto para empezar" },
    { id: "family", name: "Paquete Familiar", credits: 25, price: 80, bonus: 3, description: "Para la familia" },
    { id: "community", name: "Paquete Comunidad", credits: 50, price: 125, bonus: 8, description: "Para la comunidad" },
    { id: "enterprise", name: "Paquete Empresa", credits: 100, price: 200, bonus: 20, description: "Para empresas" },
  ],
};

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch { return DEFAULTS; }
}
function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function PricesAdmin() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => { setSettings(readSettings()); }, []);

  const updateCost = (key: "ADOPT_COST" | "WATER_COST", v: string) => {
    const n = Number(v);
    setSettings((s) => ({ ...s, [key]: Number.isFinite(n) ? Math.max(0, n) : s[key] }));
  };

  const addPackage = () => {
    const next: CreditPackage = { id: crypto.randomUUID(), name: "Nuevo paquete", credits: 10, price: 10, bonus: 0, description: "" };
    setSettings((s) => ({ ...s, packages: [...s.packages, next] }));
  };

  const updatePackage = (id: string, field: keyof CreditPackage, value: string) => {
    setSettings((s) => ({
      ...s,
      packages: s.packages.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]:
                field === "credits" || field === "price" || field === "bonus"
                  ? Math.max(0, Number(value) || 0)
                  : value,
            }
          : p
      ),
    }));
  };

  const removePackage = (id: string) => {
    setSettings((s) => ({ ...s, packages: s.packages.filter((p) => p.id !== id) }));
  };

  const handleSave = () => {
    saveSettings(settings);
    toast.success("Precios y paquetes guardados (localStorage)");
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    saveSettings(DEFAULTS);
    toast.success("Restablecido a valores por defecto");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-900">Precios y Paquetes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Costos de acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm text-gray-600">Costo de Adoptar (créditos)</Label>
            <Input
              type="number"
              min={0}
              value={settings.ADOPT_COST}
              onChange={(e) => updateCost("ADOPT_COST", e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Costo de Riego (créditos)</Label>
            <Input
              type="number"
              min={0}
              value={settings.WATER_COST}
              onChange={(e) => updateCost("WATER_COST", e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Paquetes */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-green-900">Paquetes de créditos</h3>
          <Button onClick={addPackage} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Agregar paquete
          </Button>
        </div>

        <div className="space-y-6">
          {settings.packages.map((pkg) => (
            <div key={pkg.id} className="grid md:grid-cols-12 gap-3 items-end border rounded-lg p-4">
              <div className="md:col-span-3">
                <Label>Nombre</Label>
                <Input value={pkg.name} onChange={(e) => updatePackage(pkg.id, "name", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label>Créditos</Label>
                <Input type="number" min={0} value={pkg.credits} onChange={(e) => updatePackage(pkg.id, "credits", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label>Precio (Bs)</Label>
                <Input type="number" min={0} value={pkg.price} onChange={(e) => updatePackage(pkg.id, "price", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label>Bonus</Label>
                <Input type="number" min={0} value={pkg.bonus ?? 0} onChange={(e) => updatePackage(pkg.id, "bonus", e.target.value)} />
              </div>
              <div className="md:col-span-3">
                <Label>Descripción</Label>
                <Input value={pkg.description ?? ""} onChange={(e) => updatePackage(pkg.id, "description", e.target.value)} />
              </div>
              <div className="md:col-span-12 flex justify-end">
                <Button variant="destructive" onClick={() => removePackage(pkg.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </div>
            </div>
          ))}
          {settings.packages.length === 0 && (
            <p className="text-sm text-gray-500">No hay paquetes. Agrega uno nuevo.</p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleReset}>Restablecer</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> Guardar cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default PricesAdmin;
