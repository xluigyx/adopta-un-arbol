import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Coins, Calendar, Award, TreePine, Heart, Settings, MapPin } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface AdoptedTree {
  _id: string;
  nombre: string;
  especie: string;
  descripcion?: string;
  imagen?: string;
  estadoactual?: string;
  latitud?: number;
  longitud?: number;
  fechaPlantacion?: string;
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
    _id: string;
    name: string;
    email: string;
    role: string;
    joinDate: string;
    credits: number;
  };
}

export function UserProfile({ onNavigate, user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [realCredits, setRealCredits] = useState<number>(user.credits);
  const [adoptedTrees, setAdoptedTrees] = useState<AdoptedTree[]>([]);

  // 🔹 Obtener créditos y árboles adoptados desde backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Créditos reales del usuario
        const userRes = await fetch(`http://localhost:4000/api/usuarios/${user._id}`);
        const userData = await userRes.json();
        if (userRes.ok && userData?.puntostotales !== undefined) {
          setRealCredits(userData.puntostotales);
        }

        // Árboles adoptados
        const treesRes = await fetch(`http://localhost:4000/api/planta/adoptados/${user._id}`);
        const treesData = await treesRes.json();
        if (treesRes.ok && Array.isArray(treesData)) {
          setAdoptedTrees(treesData);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
      }
    };

    fetchData();
  }, [user._id]);

  // 🔹 Logros dinámicos
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Primera Adopción",
      description: "Adoptaste tu primer árbol",
      unlockedDate: adoptedTrees.length >= 1 ? new Date().toISOString() : undefined,
    },
    {
      id: "2",
      title: "Coleccionista Verde",
      description: "Adopta 5 árboles diferentes",
      progress: adoptedTrees.length,
      maxProgress: 5,
    },
  ];

  // 🔹 Colores de estado de árboles
  const getHealthColor = (estado: string) => {
    switch (estado) {
      case "available":
        return "bg-green-100 text-green-700";
      case "adopted":
        return "bg-blue-100 text-blue-700";
      case "maintenance":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getHealthText = (estado: string) => {
    switch (estado) {
      case "available":
        return "Disponible";
      case "adopted":
        return "Adoptado";
      case "maintenance":
        return "Mantenimiento";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado del perfil */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="text-2xl bg-green-100 text-green-600">
                  {user.name.split(" ").map((n) => n[0]).join("")}
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
                    {realCredits} créditos disponibles
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => onNavigate("credits")}
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

        {/* Tarjetas de estadísticas */}
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
                {achievements.filter((a) => a.unlockedDate).length}
              </div>
              <div className="text-sm text-gray-600">Logros Desbloqueados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Coins className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{realCredits}</div>
              <div className="text-sm text-gray-600">Créditos Disponibles</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="trees">Mis Árboles</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
          </TabsList>

          {/* 🌿 Mis árboles */}
          <TabsContent value="trees">
            <div className="grid md:grid-cols-2 gap-6">
              {adoptedTrees.length === 0 ? (
                <p className="text-gray-600 text-center mt-4">
                  No has adoptado ningún árbol todavía 🌱
                </p>
              ) : (
                adoptedTrees.map((tree) => (
                  <Card key={tree._id}>
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={
                          tree.imagen
                            ? `http://localhost:4000/uploads/${tree.imagen}`
                            : "https://images.unsplash.com/photo-1605245136640-05b9ae766b06"
                        }
                        alt={tree.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-900">{tree.nombre}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 italic">{tree.especie}</p>
                      <Badge className={getHealthColor(tree.estadoactual || "")}>
                        {getHealthText(tree.estadoactual || "")}
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2 mt-2"
                        onClick={() => {
                          localStorage.setItem("selectedTree", JSON.stringify(tree));
                          onNavigate("map");
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                        Ver en Mapa
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* 🎖️ Logros */}
          <TabsContent value="achievements">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          achievement.unlockedDate ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        <Award
                          className={`h-6 w-6 ${
                            achievement.unlockedDate ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {achievement.description}
                        </p>
                        {achievement.unlockedDate ? (
                          <Badge className="bg-green-100 text-green-800">
                            Desbloqueado: {new Date(achievement.unlockedDate).toLocaleDateString()}
                          </Badge>
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
