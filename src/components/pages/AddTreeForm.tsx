import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TreePine, Save, X } from "lucide-react";
import { Planta } from "../types/Planta";

interface AddTreeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (treeData: Planta) => void;
}

export function AddTreeForm({ isOpen, onClose, onSave }: AddTreeFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    zona: "",
    latitud: "",
    longitud: "",
    cuidador: "",
    descripcion: "",
    estadoactual: "available",
    health: "good",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTree = {
      nombre: formData.nombre,
      especie: formData.especie,
      descripcion: formData.descripcion,
      estadoactual: formData.estadoactual as "available" | "adopted" | "maintenance",
      latitud: parseFloat(formData.latitud),
      longitud: parseFloat(formData.longitud),
      direccion: formData.zona,
      cuidador: formData.cuidador,
    };

    try {
      const res = await fetch("http://localhost:4000/api/plantas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTree),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error al registrar árbol");
        return;
      }

      onSave(data.planta);
      onClose();
    } catch (err) {
      console.error("Error al guardar árbol:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-600" />
            Agregar Nuevo Árbol
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y especie */}
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

          {/* Zona y cuidador */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Zona</Label>
              <Input
                value={formData.zona}
                onChange={(e) => handleInputChange("zona", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Cuidador</Label>
              <Input
                value={formData.cuidador}
                onChange={(e) => handleInputChange("cuidador", e.target.value)}
              />
            </div>
          </div>

          {/* Coordenadas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitud</Label>
              <Input
                type="number"
                step="any"
                value={formData.latitud}
                onChange={(e) => handleInputChange("latitud", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Longitud</Label>
              <Input
                type="number"
                step="any"
                value={formData.longitud}
                onChange={(e) => handleInputChange("longitud", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label>Descripción</Label>
            <Textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
            />
          </div>

          {/* Estado */}
          <div>
            <Label>Estado</Label>
            <Select
              value={formData.estadoactual}
              onValueChange={(value) => handleInputChange("estadoactual", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="adopted">Adoptado</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
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
