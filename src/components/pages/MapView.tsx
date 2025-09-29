import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CheckCircle, AlertTriangle, Save } from "lucide-react";

// leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix íconos de leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface Planta {
  _id: string;
  nombre: string;
  especie: string;
  descripcion?: string;
  estadoactual: "available" | "adopted" | "maintenance";
  latitud: number;
  longitud: number;
  imagen?: string;
}

interface MapViewProps {
  onNavigate: (view: string) => void;
  user?: { name: string; role: string };
}

export function MapView({ onNavigate, user }: MapViewProps) {
  const [trees, setTrees] = useState<Planta[]>([]);
  const [filter, setFilter] = useState<"all" | "available" | "adopted" | "maintenance">("all");
  const [newTree, setNewTree] = useState<any | null>(null);
  const [successDialog, setSuccessDialog] = useState(false);

  // cargar desde backend
  useEffect(() => {
    fetch("http://localhost:4000/api/plantas")
      .then((res) => res.json())
      .then((data) => setTrees(data))
      .catch((err) => console.error(err));
  }, []);

  // clic en el mapa → solo admin puede crear
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (user?.role === "admin") {
          setNewTree({
            latitud: e.latlng.lat,
            longitud: e.latlng.lng,
            nombre: "",
            especie: "",
            descripcion: "",
            estadoactual: "available",
          });
        }
      },
    });
    return null;
  }

  // guardar en backend
  const handleSaveTree = async () => {
    if (!newTree?.nombre || !newTree?.especie) {
      alert("Nombre y especie son obligatorios");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/plantas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTree),
      });
      const data = await res.json();
      if (res.ok) {
        setTrees((prev) => [...prev, data.planta]);
        setNewTree(null);
        setSuccessDialog(true); // abrir popup ✅
      } else {
        alert(data.msg || "Error al guardar");
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar en base de datos");
    }
  };

  const filteredTrees = filter === "all" ? trees : trees.filter((t) => t.estadoactual === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "adopted":
        return "bg-blue-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "adopted":
        return "Adoptado";
      case "maintenance":
        return "Mantenimiento";
      default:
        return status;
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "adopted":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-2">Mapa de Árboles</h1>
        <p className="text-gray-600">
          {user?.role === "admin"
            ? "Da clic en el mapa para agregar un nuevo árbol"
            : "Explora y adopta árboles en tu ciudad"}
        </p>

        {/* filtros */}
        <div className="mb-6 flex flex-wrap gap-2 mt-4">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
            Todos ({trees.length})
          </Button>
          <Button
            variant={filter === "available" ? "default" : "outline"}
            onClick={() => setFilter("available")}
            size="sm"
            className="text-green-600 border-green-200"
          >
            Disponibles ({trees.filter((t) => t.estadoactual === "available").length})
          </Button>
          <Button
            variant={filter === "adopted" ? "default" : "outline"}
            onClick={() => setFilter("adopted")}
            size="sm"
            className="text-blue-600 border-blue-200"
          >
            Adoptados ({trees.filter((t) => t.estadoactual === "adopted").length})
          </Button>
          <Button
            variant={filter === "maintenance" ? "default" : "outline"}
            onClick={() => setFilter("maintenance")}
            size="sm"
            className="text-red-600 border-red-200"
          >
            Mantenimiento ({trees.filter((t) => t.estadoactual === "maintenance").length})
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* mapa */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <MapContainer
                  center={[-17.3895, -66.1568]}
                  zoom={13}
                  className="h-full w-full rounded-lg"
                  scrollWheelZoom={true}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {trees.map((tree) => (
                    <Marker key={tree._id} position={[tree.latitud, tree.longitud]}>
                      <Popup>
                        <strong>{tree.nombre}</strong> <br />
                        {tree.especie} <br />
                        Estado: {getStatusText(tree.estadoactual)}
                      </Popup>
                    </Marker>
                  ))}

                  {newTree && (
                    <Marker position={[newTree.latitud, newTree.longitud]}>
                      <Popup onClose={() => setNewTree(null)}>
                        <div className="space-y-2">
                          <Input
                            placeholder="Nombre"
                            value={newTree.nombre}
                            onChange={(e) => setNewTree({ ...newTree, nombre: e.target.value })}
                          />
                          <Input
                            placeholder="Especie"
                            value={newTree.especie}
                            onChange={(e) => setNewTree({ ...newTree, especie: e.target.value })}
                          />
                          <Input
                            placeholder="Descripción"
                            value={newTree.descripcion}
                            onChange={(e) => setNewTree({ ...newTree, descripcion: e.target.value })}
                          />
                          <Select
                            value={newTree.estadoactual}
                            onValueChange={(value) => setNewTree({ ...newTree, estadoactual: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Disponible</SelectItem>
                              <SelectItem value="adopted">Adoptado</SelectItem>
                              <SelectItem value="maintenance">Mantenimiento</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={handleSaveTree} className="w-full bg-green-600 hover:bg-green-700">
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Árbol
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  <MapClickHandler />
                </MapContainer>
              </CardContent>
            </Card>
          </div>

          {/* lista */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredTrees.map((tree) => (
              <Card key={tree._id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-green-900">{tree.nombre}</h3>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(tree.estadoactual)}`}></div>
                      </div>
                      <p className="text-sm text-gray-600">{tree.especie}</p>
                    </div>
                    {getHealthIcon(tree.estadoactual)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Popup de confirmación */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Árbol guardado con éxito
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            El árbol fue registrado en la base de datos correctamente.
          </p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setSuccessDialog(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
