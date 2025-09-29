"use client";

import React, { useState } from 'react'; // 🔹 IMPORTANTE: React + useState
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Filter, Download, Calendar, MapPin, User, TreePine } from 'lucide-react';



// 🔹 Tipo de usuario (igual al que tienes en App.tsx)
export interface User {
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'user';
  joinDate: string;
  credits: number;
}

// 🔹 Tipo de árbol plantado
interface PlantedTree {
  id: string;
  species: string;
  commonName: string;
  planterName: string;
  planterRole: 'admin' | 'technician' | 'volunteer';
  plantedDate: string;
  zone: string;
  location: string;
  status: 'planted' | 'growing' | 'mature' | 'adopted' | 'maintenance';
  health: 'excellent' | 'good' | 'fair' | 'poor';
  adopter?: string;
  adoptedDate?: string;
  notes?: string;
}

// 🔹 Props del componente
interface HistoryPageProps {
  onNavigate: (view: string) => void;
  user?: User; // 🔹 Se agrega user opcional
}

export function HistoryPage({ onNavigate, user }: HistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  // 🔹 Datos simulados
  const plantedTrees: PlantedTree[] = [
    {
      id: '1',
      species: 'Quercus robur',
      commonName: 'Roble Común',
      planterName: 'Juan Pérez',
      planterRole: 'technician',
      plantedDate: '2024-01-15',
      zone: 'Centro',
      location: 'Parque Central - Sector A',
      status: 'adopted',
      health: 'excellent',
      adopter: 'Familia García',
      adoptedDate: '2024-02-10',
      notes: 'Plantado en suelo preparado con compost orgánico'
    },
    {
      id: '2',
      species: 'Prunus serrulata',
      commonName: 'Cerezo Japonés',
      planterName: 'María González',
      planterRole: 'admin',
      plantedDate: '2024-02-20',
      zone: 'Norte',
      location: 'Plaza Norte - Entrada Principal',
      status: 'maintenance',
      health: 'fair',
      adopter: 'Carlos López',
      adoptedDate: '2024-03-15',
      notes: 'Requiere tratamiento para pulgones'
    },
    {
      id: '3',
      species: 'Pinus sylvestris',
      commonName: 'Pino Silvestre',
      planterName: 'Ana López',
      planterRole: 'technician',
      plantedDate: '2024-03-10',
      zone: 'Sur',
      location: 'Avenida Sur - Mediana Central',
      status: 'growing',
      health: 'good',
      notes: 'Crecimiento normal según cronograma'
    },
    {
      id: '4',
      species: 'Salix babylonica',
      commonName: 'Sauce Llorón',
      planterName: 'Roberto Silva',
      planterRole: 'volunteer',
      plantedDate: '2024-03-25',
      zone: 'Centro',
      location: 'Ribera del Río - Zona 3',
      status: 'adopted',
      health: 'excellent',
      adopter: 'Escuela Primaria Verde',
      adoptedDate: '2024-04-20',
      notes: 'Plantado cerca de fuente de agua natural'
    },
    {
      id: '5',
      species: 'Citrus sinensis',
      commonName: 'Naranjo Dulce',
      planterName: 'Laura Martínez',
      planterRole: 'technician',
      plantedDate: '2024-04-05',
      zone: 'Este',
      location: 'Plaza del Barrio - Zona Residencial',
      status: 'planted',
      health: 'good',
      notes: 'Plantado en área comunitaria'
    },
    {
      id: '6',
      species: 'Ficus benjamina',
      commonName: 'Ficus Benjamín',
      planterName: 'Carlos Mendoza',
      planterRole: 'technician',
      plantedDate: '2024-04-18',
      zone: 'Oeste',
      location: 'Centro Comercial - Área Verde',
      status: 'mature',
      health: 'excellent',
      notes: 'Trasplantado desde vivero municipal'
    }
  ];

  // 🔹 Filtrado
  const filteredTrees = plantedTrees.filter(tree => {
    const matchesSearch =
      tree.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.planterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tree.status === statusFilter;
    const matchesSpecies = speciesFilter === 'all' || tree.species === speciesFilter;
    const matchesZone = zoneFilter === 'all' || tree.zone === zoneFilter;

    return matchesSearch && matchesStatus && matchesSpecies && matchesZone;
  });

  // 🔹 Helpers de colores y textos
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted': return 'bg-blue-100 text-blue-800';
      case 'growing': return 'bg-yellow-100 text-yellow-800';
      case 'mature': return 'bg-green-100 text-green-800';
      case 'adopted': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planted': return 'Plantado';
      case 'growing': return 'Creciendo';
      case 'mature': return 'Maduro';
      case 'adopted': return 'Adoptado';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-green-500';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthText = (health: string) => {
    switch (health) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'fair': return 'Regular';
      case 'poor': return 'Malo';
      default: return health;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'technician': return 'Técnico';
      case 'volunteer': return 'Voluntario';
      default: return role;
    }
  };

  const uniqueSpecies = Array.from(new Set(plantedTrees.map(tree => tree.species)));
  const uniqueZones = Array.from(new Set(plantedTrees.map(tree => tree.zone)));

  const exportData = () => {
    const csvData = filteredTrees.map(tree => ({
      Especie: tree.species,
      'Nombre Común': tree.commonName,
      Plantador: tree.planterName,
      'Fecha Plantación': tree.plantedDate,
      Zona: tree.zone,
      Estado: getStatusText(tree.status),
      Salud: getHealthText(tree.health),
      Adoptante: tree.adopter || 'N/A'
    }));
    console.log('Exportando datos:', csvData);
    alert('Datos exportados correctamente (simulación)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Historial de Árboles Plantados</h1>
          <p className="text-gray-600">Registro completo de todos los árboles plantados en el sistema</p>
          {user && <p className="text-sm text-gray-500 mt-1">Usuario: {user.name} ({user.role})</p>}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{plantedTrees.length}</div>
              <div className="text-sm text-gray-600">Total Plantados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {plantedTrees.filter(t => t.status === 'adopted').length}
              </div>
              <div className="text-sm text-gray-600">Adoptados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {plantedTrees.filter(t => new Date(t.plantedDate).getFullYear() === new Date().getFullYear()).length}
              </div>
              <div className="text-sm text-gray-600">Este Año</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{uniqueZones.length}</div>
              <div className="text-sm text-gray-600">Zonas Activas</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        {/* ...resto de tu código de filtros y tabla igual */}
      </div>
    </div>
  );
}
