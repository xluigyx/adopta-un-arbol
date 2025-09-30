"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Plus, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Planta } from "../types/Planta";
import { AddTreeForm } from "./AddTreeForm";

// Fix de íconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapViewProps {
  onNavigate: (view: string) => void;
  user?: { name: string; role: "admin" | "technician" | "user" };
}

export const MapView: React.FC<MapViewProps> = ({ onNavigate, user }) => {
  const [trees, setTrees] = useState<Planta[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "adopted" | "maintenance">("all");

  // control del modal
  const [showForm, setShowForm] = useState(false);
  const [clickLat, setClickLat] = useState<number | undefined>();
  const [clickLng, setClickLng] = useState<number | undefined>();

  // cargar plantas desde el backend
  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/planta");
        const data = await res.json();
        if (res.ok) {
          setTrees(data);
        } else {
          console.error("Error cargando plantas:", data.msg);
        }
      } catch (err) {
        console.error("Error al cargar árboles:", err);
      }
    };
    fetchTrees();
  }, []);

  // filtro de búsqueda y estado
  const filteredTrees = trees.filter(
    (tree) =>
      (tree.nombre.toLowerCase().includes(search.toLowerCase()) ||
        tree.especie.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" || tree.estadoactual === statusFilter)
  );

  // componente interno para detectar clics en el mapa
  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (user?.role === "admin") {
          setClickLat(e.latlng.lat);
          setClickLng(e.latlng.lng);
          setShowForm(true);
        }
      },
    });
    return null;
  }

  // cuando se guarda un nuevo árbol en AddTreeForm
  const handleSaveTree = (newTree: Planta) => {
    setTrees((prev) => [...prev, newTree]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-900">Mapa de Árboles</h1>
      <p className="text-gray-600 mb-4">
        {user?.role === "admin"
          ? "Haz clic en el mapa para agregar un nuevo árbol"
          : "Explora los árboles disponibles"}
      </p>

      {/* Barra de búsqueda y filtros */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar árboles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "available" | "adopted" | "maintenance")
            }
            className="border rounded p-2"
          >
            <option value="all">Todos</option>
            <option value="available">Disponible</option>
            <option value="adopted">Adoptado</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </CardContent>
      </Card>

      {/* Mapa */}
      <Card className="h-[600px]">
        <CardContent className="p-0 h-full">
          <MapContainer
            center={[-17.3895, -66.1568]}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredTrees.map((tree) => (
              <Marker
                key={tree._id}
                position={[tree.latitud, tree.longitud]}
              >
                <Popup>
                  <strong>{tree.nombre}</strong> <br />
                  {tree.especie} <br />
                  Estado: {tree.estadoactual}
                </Popup>
              </Marker>
            ))}
            {user?.role === "admin" && <LocationMarker />}
          </MapContainer>
        </CardContent>
      </Card>

      {/* Formulario para agregar árbol */}
      <AddTreeForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveTree}
        lat={clickLat}
        lng={clickLng}
      />
    </div>
  );
};
