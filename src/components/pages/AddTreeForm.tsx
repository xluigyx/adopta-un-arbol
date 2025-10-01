"use client";

import { useState } from "react";
import { Planta } from "../types/Planta"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { TreePine, Save, X } from "lucide-react";

interface AddTreeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTree: Planta) => void;
  lat?: number;
  lng?: number;
}

export function AddTreeForm({ isOpen, onClose, onSave, lat, lng }: AddTreeFormProps) {
  const [formData, setFormData] = useState<Partial<Planta>>({
    nombre: "",
    especie: "",
    descripcion: "",
    estadoactual: "available",
    latitud: lat ?? 0,
    longitud: lng ?? 0,
  });

  const [imagen, setImagen] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (field: keyof Planta, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre || "");
      formDataToSend.append("especie", formData.especie || "");
      formDataToSend.append("descripcion", formData.descripcion || "");
      formDataToSend.append("estadoactual", formData.estadoactual || "available");
      formDataToSend.append("latitud", String(lat ?? 0));
      formDataToSend.append("longitud", String(lng ?? 0));
      if (imagen) formDataToSend.append("imagen", imagen);

      const res = await fetch("http://localhost:4000/api/planta", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.msg || "❌ Error al registrar árbol" });
        return;
      }

      // ✅ éxito
      onSave(data.planta);
      setMessage({ type: "success", text: "🌳 Árbol agregado con éxito" });

      // reset form
      setFormData({
        nombre: "",
        especie: "",
        descripcion: "",
        estadoactual: "available",
        latitud: lat ?? 0,
        longitud: lng ?? 0,
      });
      setImagen(null);

      // cerrar después de un rato
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);
    } catch (err) {
      console.error("Error al guardar árbol:", err);
      setMessage({ type: "error", text: "❌ Error de conexión con el servidor" });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-800">
            <TreePine className="h-5 w-5 text-green-600" />
            Agregar Nuevo Árbol
          </DialogTitle>
        </DialogHeader>

        {/* Mensaje de éxito o error */}
        {message && (
          <div
            className={`p-3 rounded-md mb-4 text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Especie</Label>
              <Input
                value={formData.especie}
                onChange={(e) => handleInputChange("especie", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
            />
          </div>

          <div>
            <Label>Imagen</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Lat/Lng visibles (readonly) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitud</Label>
              <Input value={lat ?? ""} readOnly />
            </div>
            <div>
              <Label>Longitud</Label>
              <Input value={lng ?? ""} readOnly />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" /> Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
