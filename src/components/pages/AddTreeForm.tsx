import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TreePine, Save, X } from 'lucide-react';

interface AddTreeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (treeData: any) => void;
}

export function AddTreeForm({ isOpen, onClose, onSave }: AddTreeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    zone: '',
    latitude: '',
    longitude: '',
    caretaker: '',
    description: '',
    health: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    status: 'available' as 'available' | 'adopted' | 'maintenance'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTree = {
      id: Date.now().toString(),
      name: formData.name,
      species: formData.species,
      status: formData.status,
      health: formData.health,
      plantDate: new Date().toISOString().split('T')[0],
      caretaker: formData.caretaker,
      location: { 
        lat: parseFloat(formData.latitude), 
        lng: parseFloat(formData.longitude) 
      },
      zone: formData.zone,
      description: formData.description,
      image: 'https://images.unsplash.com/photo-1713981234047-520a91c89a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRyZWUlMjBzYXBsaW5nfGVufDF8fHx8MTc1NzcyNTUyNnww&ixlib=rb-4.1.0&q=80&w=1080'
    };

    onSave(newTree);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      species: '',
      zone: '',
      latitude: '',
      longitude: '',
      caretaker: '',
      description: '',
      health: 'good',
      status: 'available'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const speciesOptions = [
    'Quercus robur (Roble)',
    'Pinus sylvestris (Pino)',
    'Prunus serrulata (Cerezo)',
    'Salix babylonica (Sauce Llorón)',
    'Ceiba pentandra (Ceiba)',
    'Tabebuia rosea (Guayacán Rosado)',
    'Alnus acuminata (Aliso)',
    'Fraxinus chinensis (Fresno)',
    'Magnolia grandiflora (Magnolia)',
    'Ficus benjamina (Ficus)'
  ];

  const zoneOptions = [
    'Centro',
    'Norte',
    'Sur',
    'Este',
    'Oeste',
    'Noreste',
    'Noroeste',
    'Sureste',
    'Suroeste'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-600" />
            Agregar Nuevo Árbol
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-green-900">Información Básica</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Árbol</Label>
                <Input
                  id="name"
                  placeholder="Ej: Roble de la Plaza"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Especie</Label>
                <Select onValueChange={(value: string) => handleInputChange('species', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar especie" />
                  </SelectTrigger>
                  <SelectContent>
                    {speciesOptions.map((species) => (
                      <SelectItem key={species} value={species}>
                        {species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zone">Zona</Label>
                <Select onValueChange={(value: string) => handleInputChange('zone', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zoneOptions.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caretaker">Cuidador Asignado</Label>
                <Input
                  id="caretaker"
                  placeholder="Ej: Juan Pérez"
                  value={formData.caretaker}
                  onChange={(e) => handleInputChange('caretaker', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-green-900">Ubicación</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="Ej: 4.711"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="Ej: -74.072"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
              <p><strong>Tip:</strong> Puedes obtener las coordenadas haciendo clic derecho en Google Maps y seleccionando "¿Qué hay aquí?"</p>
            </div>
          </div>

          {/* Status and Health */}
          <div className="space-y-4">
            <h3 className="font-semibold text-green-900">Estado y Salud</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select onValueChange={(value: string) => handleInputChange('status', value)} defaultValue="available">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="adopted">Adoptado</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="health">Salud</Label>
                <Select onValueChange={(value: string) => handleInputChange('health', value)} defaultValue="good">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excelente</SelectItem>
                    <SelectItem value="good">Buena</SelectItem>
                    <SelectItem value="fair">Regular</SelectItem>
                    <SelectItem value="poor">Pobre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las características del árbol, su ubicación específica y cualquier información relevante..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              Guardar Árbol
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}