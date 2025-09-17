import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { MapPin, TreePine, Calendar, User, Heart, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { AddTreeForm } from './AddTreeForm';

interface Tree {
  id: string;
  name: string;
  species: string;
  status: 'available' | 'adopted' | 'maintenance';
  health: 'excellent' | 'good' | 'fair' | 'poor';
  plantDate: string;
  caretaker?: string;
  adopter?: string;
  location: { lat: number; lng: number };
  zone: string;
  description: string;
  image: string;
}

interface MapViewProps {
  onNavigate: (view: string) => void;
  user?: { name: string; role: string };
}

export function MapView({ onNavigate, user }: MapViewProps) {
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'adopted' | 'maintenance'>('all');
  const [showAddTreeForm, setShowAddTreeForm] = useState(false);
  const [trees, setTrees] = useState<Tree[]>([]);

  // Initialize trees with mock data
  useEffect(() => {
    setTrees([
      {
        id: '1',
        name: 'Roble de la Plaza',
        species: 'Quercus robur',
        status: 'available',
        health: 'excellent',
        plantDate: '2024-03-15',
        caretaker: 'Juan Pérez',
        location: { lat: 4.711, lng: -74.072 },
        zone: 'Centro',
        description: 'Hermoso roble ubicado en la plaza principal, ideal para adopción.',
        image: 'https://images.unsplash.com/photo-1605245136640-05b9ae766b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB0cmVlJTIwbWF0dXJlfGVufDF8fHx8MTc1NzcyNTUyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '2',
        name: 'Pino del Parque Norte',
        species: 'Pinus sylvestris',
        status: 'adopted',
        health: 'good',
        plantDate: '2024-01-20',
        caretaker: 'María González',
        adopter: 'Familia Rodríguez',
        location: { lat: 4.720, lng: -74.065 },
        zone: 'Norte',
        description: 'Pino joven en crecimiento, adoptado por una familia comprometida.',
        image: 'https://images.unsplash.com/photo-1644676654534-abc4f62ceee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lJTIwdHJlZSUyMGZvcmVzdHxlbnwxfHx8fDE3NTc3MjU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '3',
        name: 'Cerezo de la Avenida',
        species: 'Prunus serrulata',
        status: 'maintenance',
        health: 'fair',
        plantDate: '2023-11-10',
        caretaker: 'Carlos Mendoza',
        location: { lat: 4.698, lng: -74.080 },
        zone: 'Sur',
        description: 'Cerezo que requiere atención especial por problemas de plagas.',
        image: 'https://images.unsplash.com/photo-1526344966-89049886b28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwdHJlZXxlbnwxfHx8fDE3NTc3MjU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: '4',
        name: 'Sauce del Río',
        species: 'Salix babylonica',
        status: 'available',
        health: 'good',
        plantDate: '2024-02-28',
        caretaker: 'Ana López',
        location: { lat: 4.705, lng: -74.068 },
        zone: 'Centro',
        description: 'Elegante sauce llorón cerca del río, perfecto para adopción.',
        image: 'https://images.unsplash.com/photo-1713981234047-520a91c89a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRyZWUlMjBzYXBsaW5nfGVufDF8fHx8MTc1NzcyNTUyNnww&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ]);
  }, []);

  const filteredTrees = filter === 'all' ? trees : trees.filter(tree => tree.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'adopted': return 'bg-blue-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'adopted': return 'Adoptado';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fair': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'poor': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleAddTree = (newTree: Tree) => {
    setTrees(prevTrees => [...prevTrees, newTree]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-green-900 mb-2">Mapa de Árboles</h1>
              <p className="text-gray-600">
                {user?.role === 'admin' ? 'Gestiona y agrega nuevos árboles al sistema' : 'Explora y adopta árboles en tu ciudad'}
              </p>
            </div>
            
            {user?.role === 'admin' && (
              <Button 
                onClick={() => setShowAddTreeForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Nuevo Árbol
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Todos ({trees.length})
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            onClick={() => setFilter('available')}
            size="sm"
            className="text-green-600 border-green-200"
          >
            Disponibles ({trees.filter(t => t.status === 'available').length})
          </Button>
          <Button
            variant={filter === 'adopted' ? 'default' : 'outline'}
            onClick={() => setFilter('adopted')}
            size="sm"
            className="text-blue-600 border-blue-200"
          >
            Adoptados ({trees.filter(t => t.status === 'adopted').length})
          </Button>
          <Button
            variant={filter === 'maintenance' ? 'default' : 'outline'}
            onClick={() => setFilter('maintenance')}
            size="sm"
            className="text-red-600 border-red-200"
          >
            Mantenimiento ({trees.filter(t => t.status === 'maintenance').length})
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Area (Mock) */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] border-2 border-dashed border-gray-300">
              <CardContent className="p-8 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Mapa Interactivo
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      {user?.role === 'admin' 
                        ? 'Aquí podrás hacer clic para agregar nuevos árboles en ubicaciones específicas:'
                        : 'Aquí se mostraría el mapa interactivo con marcadores de colores:'
                      }
                    </p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Verde = Disponible</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Azul = Adoptado</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Rojo = Mantenimiento</span>
                      </div>
                    </div>
                    
                    {user?.role === 'admin' && (
                      <div className="mt-6">
                        <Button 
                          onClick={() => setShowAddTreeForm(true)}
                          variant="outline"
                          className="text-green-600 border-green-200"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Árbol Desde Mapa
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trees List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-green-900">
                Árboles {filter !== 'all' && `(${getStatusText(filter)})`}
              </h2>
              {user?.role === 'admin' && (
                <Button 
                  size="sm"
                  onClick={() => setShowAddTreeForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredTrees.map((tree) => (
                <Card key={tree.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-green-900">{tree.name}</h3>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(tree.status)}`}></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{tree.species}</p>
                        <p className="text-sm text-gray-500 mb-2">{tree.zone}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          {getHealthIcon(tree.health)}
                          <span className="text-xs text-gray-600 capitalize">{tree.health}</span>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedTree(tree)}
                            >
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <TreePine className="h-5 w-5 text-green-600" />
                                {tree.name}
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="aspect-video rounded-lg overflow-hidden">
                                  <ImageWithFallback
                                    src={tree.image}
                                    alt={tree.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                
                                {tree.status === 'available' && user?.role !== 'admin' && (
                                  <Button 
                                    className="w-full"
                                    onClick={() => onNavigate('adopt')}
                                  >
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
                                      <span className="text-gray-600">Especies:</span>
                                      <span>{tree.species}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Estado:</span>
                                      <Badge variant={tree.status === 'available' ? 'default' : 'secondary'}>
                                        {getStatusText(tree.status)}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Salud:</span>
                                      <div className="flex items-center gap-1">
                                        {getHealthIcon(tree.health)}
                                        <span className="capitalize">{tree.health}</span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Zona:</span>
                                      <span>{tree.zone}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-green-900 mb-2">Personal</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Plantado:</span>
                                      <span>{new Date(tree.plantDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Cuidador:</span>
                                      <span>{tree.caretaker}</span>
                                    </div>
                                    {tree.adopter && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Adoptado por:</span>
                                        <span>{tree.adopter}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-green-900 mb-2">Descripción</h4>
                                  <p className="text-sm text-gray-600">{tree.description}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Tree Form Modal */}
      <AddTreeForm
        isOpen={showAddTreeForm}
        onClose={() => setShowAddTreeForm(false)}
        onSave={handleAddTree}
      />
    </div>
  );
}