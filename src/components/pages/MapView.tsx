"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MapPin, Search, TreePine, Droplets, ShieldCheck } from "lucide-react";

// Import Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Tipos
export type UserRole = 'admin' | 'technician' | 'user';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  credits: number;
}

interface MapViewProps {
  onNavigate: (view: string) => void;
  user?: User;
}

// Fix de los íconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Tipado de árbol
type Tree = {
  id: number;
  name: string;
  species: string;
  status: "healthy" | "needs_water" | "needs_care";
  location: { lat: number; lng: number };
};

// Mock de árboles
const mockTrees: Tree[] = [
  { id: 1, name: "Árbol 1", species: "Roble", status: "healthy", location: { lat: 4.711, lng: -74.072 } },
  { id: 2, name: "Árbol 2", species: "Pino", status: "needs_water", location: { lat: 4.72, lng: -74.05 } },
  { id: 3, name: "Árbol 3", species: "Cedro", status: "needs_care", location: { lat: 4.7, lng: -74.06 } },
];

// Componente MapView
const MapView: React.FC<MapViewProps> = ({ onNavigate, user }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTrees = useMemo(() => {
    return mockTrees.filter(
      (tree) =>
        (tree.name.toLowerCase().includes(search.toLowerCase()) ||
          tree.species.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "all" || tree.status === statusFilter)
    );
  }, [search, statusFilter]);

  const getStatusIcon = (status: Tree["status"]) => {
    switch (status) {
      case "healthy": return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case "needs_water": return <Droplets className="h-5 w-5 text-blue-500" />;
      case "needs_care": return <TreePine className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: Tree["status"]) => {
    switch (status) {
      case "healthy": return "Saludable";
      case "needs_water": return "Necesita agua";
      case "needs_care": return "Requiere cuidado";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Filtros */}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="healthy">Saludable</SelectItem>
              <SelectItem value="needs_water">Necesita agua</SelectItem>
              <SelectItem value="needs_care">Requiere cuidado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              <MapContainer
                center={[-17.3895, -66.1568]} // Cochabamba, Bolivia
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full rounded-lg"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredTrees.map((tree) => (
                  <Marker key={tree.id} position={[tree.location.lat, tree.location.lng]}>
                    <Popup>
                      <strong>{tree.name}</strong> <br />
                      {tree.species} <br />
                      Estado: {getStatusText(tree.status)}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>
        </div>

        {/* Lista de árboles */}
        <div className="space-y-4">
          {filteredTrees.map((tree) => (
            <Card key={tree.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{tree.name}</h3>
                  <p className="text-sm text-gray-500">{tree.species}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(tree.status)}
                  <span className="text-sm">{getStatusText(tree.status)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredTrees.length === 0 && (
            <Card>
              <CardContent className="p-4 text-center text-gray-500">
                No se encontraron árboles
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
