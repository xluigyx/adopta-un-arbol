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
  Pencil,
  Trash,
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-extra-markers";
import { toast } from "sonner";

import { AddTreeForm } from "./AddTreeForm";
import { Planta } from "../types/Planta";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface MapViewProps {
  onNavigate: (view: string) => void;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
  };
}

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
  const [showAddTreeForm, setShowAddTreeForm] = useState(false);
  const [editingTree, setEditingTree] = useState<Planta | null>(null);
  const [clickedPosition, setClickedPosition] = useState<{ lat: number; lng: number } | null>(null);

  // ✅ Cargar árboles del backend
  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/planta");
      const data = await res.json();
      setTrees(data);
    } catch (err) {
      console.error("❌ Error al obtener plantas:", err);
    }
  };

  // ✅ Adoptar árbol
  const handleAdoptTree = async (treeId: string) => {
    if (!user?._id) {
      toast.error("No se encontró el usuario en sesión.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/planta/adopt/${treeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: user._id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Error al adoptar el árbol");

      toast.success(data.msg || "🌳 Árbol adoptado con éxito");

      setTrees((prev) =>
        prev.map((t) =>
          t._id === treeId ? { ...t, estadoactual: "adopted" } : t
        )
      );
      setSelectedTree(null);
    } catch (error) {
      console.error("Error al adoptar árbol:", error);
      toast.error("Error al adoptar el árbol");
    }
  };

  // ✅ Eliminar árbol
  const handleDeleteTree = async (treeId: string) => {
    if (!confirm("¿Seguro que quieres eliminar este árbol?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/planta/${treeId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.msg);

      toast.success("🗑️ Árbol eliminado correctamente");
      setTrees((prev) => prev.filter((t) => t._id !== treeId));
      setSelectedTree(null);
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar el árbol");
    }
  };

  // ✅ Actualizar árbol en frontend tras guardar/editar
  const handleSaveTree = (tree: Planta) => {
    if (editingTree) {
      setTrees((prev) =>
        prev.map((t) => (t._id === tree._id ? tree : t))
      );
      setEditingTree(null);
    } else {
      setTrees((prev) => [...prev, tree]);
    }
  };

  // 🎨 Íconos de estado
  const icons = {
    available: (L as any).ExtraMarkers.icon({
      icon: "fa-tree",
      markerColor: "green",
      shape: "circle",
      prefix: "fa",
    }),
    adopted: (L as any).ExtraMarkers.icon({
      icon: "fa-tree",
      markerColor: "blue",
      shape: "circle",
      prefix: "fa",
    }),
    maintenance: (L as any).ExtraMarkers.icon({
      icon: "fa-tree",
      markerColor: "red",
      shape: "circle",
      prefix: "fa",
    }),
  };

  // 📋 Texto de estado
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              Mapa de Árboles
            </h1>
            <p className="text-gray-600">
              {user?.role === "admin"
                ? "Gestiona, edita o elimina árboles del sistema"
                : "Explora y adopta árboles en tu ciudad"}
            </p>
          </div>

          {user?.role === "admin" && (
            <Button
              onClick={() => {
                setEditingTree(null);
                setShowAddTreeForm(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Árbol
            </Button>
          )}
        </div>

        {/* MAPA */}
        <div className="h-[600px] w-full mb-8 rounded-lg overflow-hidden shadow-lg border">
          <MapContainer
            center={[-17.39, -66.15]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {user?.role === "admin" && (
              <MapClickHandler
                onMapClick={(lat, lng) => {
                  setClickedPosition({ lat, lng });
                  setEditingTree(null);
                  setShowAddTreeForm(true);
                }}
              />
            )}

            {trees.map((tree) => (
              <Marker
                key={tree._id}
                position={[tree.latitud, tree.longitud]}
                icon={icons[tree.estadoactual as keyof typeof icons]}
                eventHandlers={{
                  click: () => setSelectedTree(tree),
                }}
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

        {/* MODAL DETALLE */}
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

                  {/* Botones según rol */}
                  {user?.role === "admin" ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingTree(selectedTree);
                          setShowAddTreeForm(true);
                          setSelectedTree(null);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Editar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTree(selectedTree._id)}
                      >
                        <Trash className="h-4 w-4 mr-2" /> Eliminar
                      </Button>
                    </div>
                  ) : (
                    selectedTree.estadoactual === "available" && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleAdoptTree(selectedTree._id)}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Adoptar Este Árbol
                      </Button>
                    )
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">
                      Información Básica
                    </h4>
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

        {/* FORMULARIO (AGREGAR / EDITAR) */}
        <AddTreeForm
          isOpen={showAddTreeForm}
          onClose={() => {
            setShowAddTreeForm(false);
            setEditingTree(null);
          }}
          onSave={handleSaveTree}
          lat={clickedPosition?.lat}
          lng={clickedPosition?.lng}
          editingTree={editingTree}
        />
      </div>
    </div>
  );
}
