import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Droplets, Sun, Thermometer, Ruler, TreePine } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Species {
  id: string;
  scientificName: string;
  commonName: string;
  description: string;
  averageHeight: string;
  careRequirements: {
    water: 'low' | 'medium' | 'high';
    sunlight: 'partial' | 'full' | 'shade';
    climate: 'tropical' | 'temperate' | 'cold';
  };
  characteristics: string[];
  availableCount: number;
  image: string;
  category: 'native' | 'ornamental' | 'fruit';
}

interface SpeciesPageProps {
  onNavigate: (view: string) => void;
}

export function SpeciesPage({ onNavigate }: SpeciesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const species: Species[] = [
    {
      id: '1',
      scientificName: 'Quercus robur',
      commonName: 'Roble Común',
      description: 'Árbol de gran porte y longevidad, ideal para parques urbanos. Sus hojas lobuladas proporcionan excelente sombra y su madera es muy resistente.',
      averageHeight: '25-40 metros',
      careRequirements: {
        water: 'medium',
        sunlight: 'full',
        climate: 'temperate'
      },
      characteristics: ['Larga vida', 'Buena sombra', 'Resistente al viento', 'Hojas lobuladas'],
      availableCount: 45,
      image: 'https://images.unsplash.com/photo-1605245136640-05b9ae766b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB0cmVlJTIwbWF0dXJlfGVufDF8fHx8MTc1NzcyNTUyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'native'
    },
    {
      id: '2',
      scientificName: 'Pinus sylvestris',
      commonName: 'Pino Silvestre',
      description: 'Conífera de crecimiento rápido, perfecta para zonas urbanas. Su forma cónica y follaje perenne la hacen ideal para decoración urbana.',
      averageHeight: '20-35 metros',
      careRequirements: {
        water: 'low',
        sunlight: 'full',
        climate: 'temperate'
      },
      characteristics: ['Crecimiento rápido', 'Follaje perenne', 'Resistente sequía', 'Forma cónica'],
      availableCount: 32,
      image: 'https://images.unsplash.com/photo-1644676654534-abc4f62ceee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lJTIwdHJlZSUyMGZvcmVzdHxlbnwxfHx8fDE3NTc3MjU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'native'
    },
    {
      id: '3',
      scientificName: 'Prunus serrulata',
      commonName: 'Cerezo Japonés',
      description: 'Árbol ornamental famoso por su espectacular floración primaveral. Sus flores rosadas transforman cualquier espacio urbano.',
      averageHeight: '8-12 metros',
      careRequirements: {
        water: 'medium',
        sunlight: 'full',
        climate: 'temperate'
      },
      characteristics: ['Floración espectacular', 'Ornamental', 'Atrae polinizadores', 'Hojas coloridas en otoño'],
      availableCount: 28,
      image: 'https://images.unsplash.com/photo-1526344966-89049886b28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwdHJlZXxlbnwxfHx8fDE3NTc3MjU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'ornamental'
    },
    {
      id: '4',
      scientificName: 'Salix babylonica',
      commonName: 'Sauce Llorón',
      description: 'Árbol elegante con ramas colgantes, ideal para espacios cerca de fuentes de agua. Su forma única es muy apreciada en paisajismo.',
      averageHeight: '15-25 metros',
      careRequirements: {
        water: 'high',
        sunlight: 'partial',
        climate: 'temperate'
      },
      characteristics: ['Ramas colgantes', 'Ama la humedad', 'Crecimiento rápido', 'Muy ornamental'],
      availableCount: 18,
      image: 'https://images.unsplash.com/photo-1713981234047-520a91c89a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRyZWUlMjBzYXBsaW5nfGVufDF8fHx8MTc1NzcyNTUyNnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'ornamental'
    },
    {
      id: '5',
      scientificName: 'Citrus sinensis',
      commonName: 'Naranjo Dulce',
      description: 'Árbol frutal de tamaño medio, perfecto para espacios urbanos. Produce frutos comestibles y tiene un aroma agradable.',
      averageHeight: '6-10 metros',
      careRequirements: {
        water: 'medium',
        sunlight: 'full',
        climate: 'tropical'
      },
      characteristics: ['Frutos comestibles', 'Aroma agradable', 'Flores blancas', 'Tamaño compacto'],
      availableCount: 15,
      image: 'https://images.unsplash.com/photo-1694161340913-5fb5ca5f983f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwc3BlY2llcyUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NTc3MjU1MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'fruit'
    },
    {
      id: '6',
      scientificName: 'Ficus benjamina',
      commonName: 'Ficus Benjamín',
      description: 'Árbol tropical de follaje denso, excelente para purificación del aire urbano. Muy resistente y de fácil mantenimiento.',
      averageHeight: '10-20 metros',
      careRequirements: {
        water: 'medium',
        sunlight: 'partial',
        climate: 'tropical'
      },
      characteristics: ['Follaje denso', 'Purifica el aire', 'Muy resistente', 'Crecimiento constante'],
      availableCount: 22,
      image: 'https://images.unsplash.com/photo-1644380344134-c8986ef44b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRyZWVzJTIwdXJiYW4lMjBmb3Jlc3R8ZW58MXx8fHwxNTc3MjU1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'native'
    }
  ];

  const filteredSpecies = species.filter(sp => {
    const matchesSearch = sp.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sp.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || sp.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCareIcon = (type: string, level: string) => {
    const iconClass = "h-4 w-4";
    let color = "text-gray-400";
    
    if (level === 'high' || level === 'full') color = "text-green-600";
    else if (level === 'medium' || level === 'partial') color = "text-yellow-500";
    else color = "text-blue-500";

    switch (type) {
      case 'water':
        return <Droplets className={`${iconClass} ${color}`} />;
      case 'sunlight':
        return <Sun className={`${iconClass} ${color}`} />;
      case 'climate':
        return <Thermometer className={`${iconClass} ${color}`} />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'native': return 'bg-green-100 text-green-800';
      case 'ornamental': return 'bg-purple-100 text-purple-800';
      case 'fruit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'native': return 'Nativa';
      case 'ornamental': return 'Ornamental';
      case 'fruit': return 'Frutal';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Especies de Árboles</h1>
          <p className="text-gray-600">Descubre las diferentes especies disponibles para adopción</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre común o científico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="native">Nativas</SelectItem>
              <SelectItem value="ornamental">Ornamentales</SelectItem>
              <SelectItem value="fruit">Frutales</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Species Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecies.map((sp) => (
            <Card key={sp.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={sp.image}
                  alt={sp.commonName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-green-900 mb-1">
                      {sp.commonName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 italic mb-2">
                      {sp.scientificName}
                    </p>
                  </div>
                  <Badge className={getCategoryColor(sp.category)}>
                    {getCategoryText(sp.category)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {sp.description}
                </p>

                {/* Height and availability */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Ruler className="h-4 w-4" />
                    <span>{sp.averageHeight}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TreePine className="h-4 w-4" />
                    <span>{sp.availableCount} disponibles</span>
                  </div>
                </div>

                {/* Care requirements */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Requerimientos de Cuidado:</h4>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      {getCareIcon('water', sp.careRequirements.water)}
                      <span className="text-xs text-gray-600 capitalize">
                        Agua: {sp.careRequirements.water === 'high' ? 'Alta' : 
                               sp.careRequirements.water === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCareIcon('sunlight', sp.careRequirements.sunlight)}
                      <span className="text-xs text-gray-600 capitalize">
                        Sol: {sp.careRequirements.sunlight === 'full' ? 'Pleno' :
                              sp.careRequirements.sunlight === 'partial' ? 'Parcial' : 'Sombra'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCareIcon('climate', sp.careRequirements.climate)}
                      <span className="text-xs text-gray-600 capitalize">
                        {sp.careRequirements.climate === 'tropical' ? 'Tropical' :
                         sp.careRequirements.climate === 'temperate' ? 'Templado' : 'Frío'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Características:</h4>
                  <div className="flex flex-wrap gap-1">
                    {sp.characteristics.map((char, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    className="w-full" 
                    onClick={() => onNavigate('map')}
                    disabled={sp.availableCount === 0}
                  >
                    {sp.availableCount > 0 ? 'Ver en Mapa' : 'No disponible'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpecies.length === 0 && (
          <div className="text-center py-12">
            <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No se encontraron especies
            </h3>
            <p className="text-gray-500">
              Intenta con diferentes términos de búsqueda o filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
}