"use client";

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
import { Planta } from "../types/Planta";

// 🌳 Interfaz de planta


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
  const [showAddTreeForm, setShowAddTreeForm] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [editingTree, setEditingTree] = useState<Planta | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [treeToDelete, setTreeToDelete] = useState<Planta | null>(null);

  // 🔹 Cargar plantas
  const fetchTrees = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/planta");
      const data = await res.json();

      // Verificar si alguna planta tiene solicitud de riego activa
      const riegoRes = await fetch("http://localhost:4000/api/tecnico/pendientes");
      const riegos = await riegoRes.json();

      const updated = data.map((planta: Planta) => ({
        ...planta,
        riegoActivo: riegos.some((r: any) => r.treeId === planta._id && r.status !== "completed"),
      }));

      setTrees(updated);
    } catch (err) {
      console.error("❌ Error al obtener plantas:", err);
      toast.error("Error al cargar árboles desde el servidor.");
    }
  };

  useEffect(() => {
    fetchTrees();
  }, []);

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
      markerColor: "orange",
      shape: "circle",
      prefix: "fa",
    }),
    watering: (L as any).ExtraMarkers.icon({
      icon: "fa-tint",
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
      if (!res.ok) throw new Error(data.msg || "Error al adoptar");

      toast.success(data.msg || "🌳 Árbol adoptado con éxito");
      fetchTrees();
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
      fetchTrees();
    } catch (err: any) {
      toast.error("❌ " + err.message);
    }
  };

  // 🌱 Agregar nuevo árbol
  const handleAddTree = () => {
    fetchTrees();
  };

  // ✏️ Editar árbol
  const handleEditTree = (tree: Planta) => {
    setEditingTree(tree);
    setShowAddTreeForm(true);
  };

  // 🗑️ Eliminar árbol
  const handleDeleteTree = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/planta/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🗑️ Árbol eliminado correctamente");
        fetchTrees();
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">Mapa de Árboles</h1>
            <p className="text-gray-600">
              {user?.role === "admin"
                ? "Gestiona, edita y elimina árboles del sistema"
                : "Explora, adopta o solicita riego 🌱"}
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
              <Plus className="mr-2 h-4 w-4" /> Agregar Árbol
            </Button>
          )}
        </div>

        <div className="h-[600px] w-full mb-8 rounded-lg overflow-hidden shadow-md border">
          <MapContainer center={[-17.39, -66.15]} zoom={13} style={{ height: "100%", width: "100%" }}>
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

            {trees.map((tree) => (
              <Marker
                key={tree._id}
                position={[tree.latitud, tree.longitud]}
                icon={
                  tree.riegoActivo
                    ? icons.watering
                    : icons[tree.estadoactual as keyof typeof icons]
                }
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

        {/* 🌳 Modal Detalle Árbol */}
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
                  {user?.role === "user" && selectedTree.estadoactual === "available" && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleAdoptTree(selectedTree._id)}
                    >
                      <Heart className="mr-2 h-4 w-4" /> Adoptar este árbol (35 créditos)
                    </Button>
                  )}

                  {user?.role === "user" && selectedTree.estadoactual === "adopted" && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleWaterRequest(selectedTree)}
                    >
                      <Droplets className="mr-2 h-4 w-4" /> Solicitar riego (10 créditos)
                    </Button>
                  )}

                  {user?.role === "admin" && (
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => handleEditTree(selectedTree)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => {
                          setTreeToDelete(selectedTree);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                      </Button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Información Básica</h4>
                    <p className="text-sm text-gray-700">Especie: {selectedTree.especie}</p>
                    <p className="text-sm text-gray-700">Estado: {selectedTree.estadoactual}</p>
                    <p className="text-sm text-gray-700">
                      Descripción: {selectedTree.descripcion || "Sin descripción"}
                    </p>
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

        {/* 📋 Formulario agregar/editar árbol */}
        <AddTreeForm
          isOpen={showAddTreeForm}
          onClose={() => setShowAddTreeForm(false)}
          onSave={handleAddTree}
          lat={clickedPosition?.lat}
          lng={clickedPosition?.lng}
          editingTree={editingTree}
        />

        {/* 🗑️ Modal de confirmación */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-700">
                <Trash2 className="h-5 w-5" /> Confirmar eliminación
              </DialogTitle>
            </DialogHeader>

            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm mb-3">
              ⚠️ Esta acción eliminará permanentemente el árbol y sus datos asociados.
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <p className="text-gray-700 text-sm">
                  ¿Seguro que deseas eliminar el árbol{" "}
                  <strong>{treeToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
                </p>
              </div>

              {treeToDelete?.imagen && (
                <img
                  src={`http://localhost:4000/uploads/${treeToDelete.imagen}`}
                  alt={treeToDelete.nombre}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                  if (!treeToDelete) return;
                  await handleDeleteTree(treeToDelete._id);
                  setShowDeleteModal(false);
                  setTreeToDelete(null);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar definitivamente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
