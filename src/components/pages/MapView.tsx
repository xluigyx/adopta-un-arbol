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
  Droplets,
  CheckCircle,
  Plus,
  Coins,
  Edit,
  Trash2,
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-extra-markers";
import { toast } from "sonner";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AddTreeForm } from "./AddTreeForm";

// 🌳 Interfaz de planta
interface Planta {
  _id: string;
  nombre: string;
  especie: string;
  descripcion?: string;
  estadoactual: "available" | "adopted" | "maintenance";
  latitud: number;
  longitud: number;
  direccion?: string;
  imagen?: string;
  adoptante?: string;
}

interface MapViewProps {
  onNavigate: (view: string) => void;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "technician" | "user";
    joinDate: string;
    credits: number;
  };
}

// 🔹 Manejador de clicks en el mapa (solo admin)
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

  // 🔹 Cargar plantas
  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/planta");
        const data = await res.json();
        setTrees(data);
      } catch (err) {
        console.error("❌ Error al obtener plantas:", err);
        toast.error("Error al cargar árboles desde el servidor.");
      }
    };
    fetchTrees();
  }, []);

  // 🔹 Filtrar según estado
  const filteredTrees =
    filter === "all" ? trees : trees.filter((tree) => tree.estadoactual === filter);

  // 🔹 Iconos personalizados
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

  // 💚 Adoptar árbol
  const handleAdoptTree = async (treeId: string) => {
    if (!user?._id) {
      toast.error("Debes iniciar sesión para adoptar.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/planta/adopt/${treeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: user._id }),
      });

      const data = await res.json();

      if (!res.ok && data.msg?.includes("créditos suficientes")) {
        toast.warning(data.msg, {
          description: "Serás redirigido para recargar tus créditos 💰",
        });
        setTimeout(() => onNavigate("credits"), 3000);
        return;
      }

      if (!res.ok) throw new Error(data.msg || "Error al adoptar");

      toast.success(data.msg || "🌳 Árbol adoptado con éxito");

      setTrees((prev) =>
        prev.map((t) =>
          t._id === treeId ? { ...t, estadoactual: "adopted" } : t
        )
      );
      setSelectedTree(null);
    } catch (error) {
      console.error("Error al adoptar:", error);
      toast.error("Error al adoptar el árbol");
    }
  };

  // 💧 Solicitar riego
  const handleWaterRequest = async (tree: Planta) => {
    try {
      if (!user?._id) {
        toast.warning("⚠️ Debes iniciar sesión para solicitar un riego.");
        return;
      }

      const res = await fetch("http://localhost:4000/api/tecnico/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: user._id,
          requesterName: user.name,
          treeId: tree._id,
          treeName: tree.nombre,
          location: tree.direccion || "Ubicación desconocida",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al solicitar riego");

      toast.success("💧 Solicitud de riego enviada al técnico");

      if (data.creditosRestantes !== undefined) {
        user.credits = data.creditosRestantes;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err: any) {
      toast.error("❌ " + err.message);
    }
  };

  // 🌱 Agregar nuevo árbol
  const handleAddTree = (newTree: Planta) => {
    setTrees((prev) => [...prev, newTree]);
  };

  // ✏️ Editar árbol
  const handleEditTree = async (id: string, updatedData: Partial<Planta>) => {
    try {
      const res = await fetch(`http://localhost:4000/api/planta/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🌿 Árbol actualizado correctamente");
        setTrees((prev) =>
          prev.map((t) => (t._id === id ? { ...t, ...updatedData } : t))
        );
      } else {
        toast.error(data.msg || "Error al actualizar árbol");
      }
    } catch (error) {
      console.error("❌ Error al editar árbol:", error);
    }
  };

  // 🗑️ Eliminar árbol
  const handleDeleteTree = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este árbol?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/planta/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🗑️ Árbol eliminado");
        setTrees((prev) => prev.filter((t) => t._id !== id));
      } else {
        toast.error(data.msg || "Error al eliminar árbol");
      }
    } catch (error) {
      console.error("❌ Error al eliminar árbol:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              Mapa de Árboles
            </h1>
            <p className="text-gray-600">
              {user?.role === "admin"
                ? "Gestiona, edita y agrega árboles al sistema"
                : "Explora, adopta o solicita riego 🌱"}
            </p>
          </div>

          {user?.role === "admin" && (
            <Button
              onClick={() => setShowAddTreeForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar Árbol
            </Button>
          )}
        </div>

        {/* Mapa */}
        <div className="h-[600px] w-full mb-8 rounded-lg overflow-hidden shadow-md border">
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
                  setShowAddTreeForm(true);
                }}
              />
            )}

            {filteredTrees.map((tree) => (
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

        {/* Modal de árbol seleccionado */}
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
                  <div className="aspect-video rounded-lg overflow-hidden shadow">
                    <ImageWithFallback
                      src={`http://localhost:4000/uploads/${selectedTree.imagen}`}
                      alt={selectedTree.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Botones según rol */}
                  {selectedTree.estadoactual === "available" && user?.role !== "admin" && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleAdoptTree(selectedTree._id)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Adoptar este árbol (35 créditos)
                    </Button>
                  )}

                  {selectedTree.estadoactual === "adopted" && user?.role === "user" && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleWaterRequest(selectedTree)}
                    >
                      <Droplets className="mr-2 h-4 w-4" />
                      Solicitar riego (10 créditos)
                    </Button>
                  )}

                  {user?.role === "admin" && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleEditTree(selectedTree._id, { estadoactual: "maintenance" })
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTree(selectedTree._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                      </Button>
                    </div>
                  )}
                </div>

                {/* Info árbol */}
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
                        <Badge>{selectedTree.estadoactual}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descripción:</span>
                        <span>{selectedTree.descripcion || "Sin descripción"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">
                      Ubicación
                    </h4>
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
