import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { User, Heart, TreePine, Coins, Calendar, Award, MapPin, Settings } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AdoptedTree {
  id: string;
  name: string;
  species: string;
  adoptedDate: string;
  location: string;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  lastUpdate: string;
  image: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface UserProfileProps {
  onNavigate: (view: string) => void;
  user: {
    name: string;
    email: string;
    role: string;
    joinDate: string;
    credits: number;
  };
}

export function UserProfile({ onNavigate, user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const adoptedTrees: AdoptedTree[] = [
    {
      id: '1',
      name: 'Mi Roble',
      species: 'Quercus robur',
      adoptedDate: '2024-01-15',
      location: 'Parque Central',
      health: 'excellent',
      lastUpdate: '2024-09-10',
      image: 'https://images.unsplash.com/photo-1605245136640-05b9ae766b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB0cmVlJTIwbWF0dXJlfGVufDF8fHx8MTc1NzcyNTUyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      name: 'Cerezo Familiar',
      species: 'Prunus serrulata',
      adoptedDate: '2024-03-20',
      location: 'Plaza Norte',
      health: 'good',
      lastUpdate: '2024-09-08',
      image: 'https://images.unsplash.com/photo-1526344966-89049886b28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwdHJlZXxlbnwxfHx8fDE3NTc3MjU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primer Adopción',
      description: 'Adoptaste tu primer árbol',
      unlockedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Cuidador Comprometido',
      description: 'Mantuviste tus árboles por 6 meses',
      unlockedDate: '2024-07-15'
    },
    {
      id: '3',
      title: 'Coleccionista Verde',
      description: 'Adopta 5 árboles diferentes',
      progress: 2,
      maxProgress: 5
    },
    {
      id: '4',
      title: 'Amigo del Bosque',
      description: 'Refiere a 3 nuevos usuarios',
      progress: 1,
      maxProgress: 3
    }
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-green-500 bg-green-50';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-2xl bg-green-100 text-green-600">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <h1 className="text-3xl font-bold text-green-900">{user.name}</h1>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Miembro desde {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      {user.credits} créditos disponibles
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => onNavigate('credits')}
                    className="flex items-center gap-2"
                  >
                    <Coins className="h-4 w-4" />
                    Comprar Créditos
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{adoptedTrees.length}</div>
              <div className="text-sm text-gray-600">Árboles Adoptados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">245</div>
              <div className="text-sm text-gray-600">Días Cuidando</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {achievements.filter(a => a.unlockedDate).length}
              </div>
              <div className="text-sm text-gray-600">Logros Desbloqueados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Coins className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{user.credits}</div>
              <div className="text-sm text-gray-600">Créditos Disponibles</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="trees">Mis Árboles</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Actualizaste el estado de tu Roble</p>
                      <p className="text-xs text-gray-500">Hace 2 días</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Adoptaste un nuevo Cerezo</p>
                      <p className="text-xs text-gray-500">Hace 1 semana</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Desbloqueaste el logro "Cuidador Comprometido"</p>
                      <p className="text-xs text-gray-500">Hace 2 semanas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => onNavigate('map')}
                  >
                    <TreePine className="mr-2 h-4 w-4" />
                    Adoptar Nuevo Árbol
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => onNavigate('credits')}
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    Comprar Créditos
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => onNavigate('species')}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Explorar Especies
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trees" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {adoptedTrees.map((tree) => (
                <Card key={tree.id}>
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={tree.image}
                      alt={tree.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-green-900">{tree.name}</CardTitle>
                        <p className="text-sm text-gray-600 italic">{tree.species}</p>
                      </div>
                      <Badge className={getHealthColor(tree.health)}>
                        {getHealthText(tree.health)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adoptado:</span>
                        <span>{new Date(tree.adoptedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ubicación:</span>
                        <span>{tree.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Última actualización:</span>
                        <span>{new Date(tree.lastUpdate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MapPin className="mr-1 h-3 w-3" />
                        Ver en Mapa
                      </Button>
                      <Button size="sm" className="flex-1">
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {adoptedTrees.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No has adoptado ningún árbol aún
                  </h3>
                  <p className="text-gray-500 mb-4">
                    ¡Comienza tu viaje verde adoptando tu primer árbol!
                  </p>
                  <Button onClick={() => onNavigate('map')}>
                    Explorar Árboles Disponibles
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.unlockedDate ? '' : 'opacity-75'}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${achievement.unlockedDate ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Award className={`h-6 w-6 ${achievement.unlockedDate ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 mb-1">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                        
                        {achievement.unlockedDate ? (
                          <Badge className="bg-green-100 text-green-800">
                            Desbloqueado: {new Date(achievement.unlockedDate).toLocaleDateString()}
                          </Badge>
                        ) : achievement.progress !== undefined ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progreso</span>
                              <span className="text-gray-900">
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress 
                              value={(achievement.progress! / achievement.maxProgress!) * 100} 
                              className="h-2"
                            />
                          </div>
                        ) : (
                          <Badge variant="secondary">Bloqueado</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}