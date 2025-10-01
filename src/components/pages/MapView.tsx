import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  MapPin,
  TreePine,
  Heart,
  AlertTriangle,
  CheckCircle,
  Plus,
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-extra-markers"; // 👈 importante

import { AddTreeForm } from "./AddTreeForm";
import { Planta } from "../types/Planta";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface MapViewProps {
  onNavigate: (view: string) => void;
  user?: { name: string; role: string };
}

// componente para manejar clicks en el mapa
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapView({ onNavigate, user }: MapViewProps) {
  const [trees, setTrees] = useState<Planta[]>([]);
  const [selectedTree, setSelectedTree] = useState<Planta | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "adopted" | "maintenance">("all");
  const [showAddTreeForm, setShowAddTreeForm] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<{ lat: number; lng: number } | null>(null);

  // cargar plantas del backend
  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/planta");
        const data = await res.json();
        setTrees(data);
      } catch (err) {
        console.error("❌ Error al obtener plantas:", err);
      }
    };
    fetchTrees();
  }, []);

  const filteredTrees =
    filter === "all" ? trees : trees.filter((tree) => tree.estadoactual === filter);

  // íconos de colores con ExtraMarkers
  const greenIcon = (L as any).ExtraMarkers.icon({
    icon: "fa-tree",
    markerColor: "green",
    shape: "circle",
    prefix: "fa",
  });

  const blueIcon = (L as any).ExtraMarkers.icon({
    icon: "fa-tree",
    markerColor: "blue",
    shape: "circle",
    prefix: "fa",
  });

  const redIcon = (L as any).ExtraMarkers.icon({
    icon: "fa-tree",
    markerColor: "red",
    shape: "circle",
    prefix: "fa",
  });

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

  const getHealthIcon = (salud?: string) => {
    switch (salud) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "fair":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "poor":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleAddTree = (newTree: Planta) => {
    setTrees((prev) => [...prev, newTree]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">Mapa de Árboles</h1>
            <p className="text-gray-600">
              {user?.role === "admin"
                ? "Gestiona y agrega nuevos árboles al sistema"
                : "Explora y adopta árboles en tu ciudad"}
            </p>
          </div>

          {user?.role === "admin" && (
            <Button
              onClick={() => setShowAddTreeForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Nuevo Árbol
            </Button>
          )}
        </div>

        {/* Mapa con react-leaflet */}
        <div className="h-[600px] w-full mb-8">
          <MapContainer
            center={[-17.39, -66.15]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Click handler solo para admin */}
            {user?.role === "admin" && (
              <MapClickHandler
                onMapClick={(lat, lng) => {
                  setClickedPosition({ lat, lng });
                  setShowAddTreeForm(true);
                }}
              />
            )}

            {/* Marcadores */}
            {filteredTrees.map((tree) => (
              <Marker
                key={tree._id}
                position={[tree.latitud, tree.longitud]}
                eventHandlers={{
                  click: () => setSelectedTree(tree),
                }}
                icon={
                  tree.estadoactual === "available"
                    ? greenIcon
                    : tree.estadoactual === "adopted"
                    ? blueIcon
                    : redIcon
                }
              >
                <Popup>
                  <strong>{tree.nombre}</strong>
                  <br />
                  {tree.especie}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Detalles de árbol seleccionado */}
        {selectedTree && (
          <Dialog open={!!selectedTree} onOpenChange={() => setSelectedTree(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  {selectedTree.nombre}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={`http://localhost:4000/uploads/${selectedTree.imagen}`}
                      alt={selectedTree.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {selectedTree.estadoactual === "available" && user?.role !== "admin" && (
                    <Button className="w-full" onClick={() => onNavigate("adopt")}>
                      <Heart className="mr-2 h-4 w-4" />
                      Adoptar Este Árbol
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Información Básica</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Especie:</span>
                        <span>{selectedTree.especie}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <Badge>{getStatusText(selectedTree.estadoactual)}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descripción:</span>
                        <span>{selectedTree.descripcion || "Sin descripción"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Ubicación</h4>
                    <p className="text-sm text-gray-600">
                      Lat: {selectedTree.latitud}, Lng: {selectedTree.longitud}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Formulario agregar árbol */}
        <AddTreeForm
          isOpen={showAddTreeForm}
          onClose={() => setShowAddTreeForm(false)}
          onSave={handleAddTree}
          lat={clickedPosition?.lat}
          lng={clickedPosition?.lng}
        />
      </div>
    </div>
  );
}
