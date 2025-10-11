import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Coins,
  Calendar,
  Award,
  TreePine,
  Heart,
  Settings,
  MapPin,
  Droplets,
} from "lucide-react";
import { toast } from "sonner";
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

interface Riego {
  _id: string;
  treeName: string;
  treeCondition: string;
  technicianName: string;
  completedAt: string;
  photoEvidence?: string;
  notes?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked?: boolean;
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
  const [activeTab, setActiveTab] = useState("trees");
  const [realCredits, setRealCredits] = useState<number>(user.credits);
  const [adoptedTrees, setAdoptedTrees] = useState<AdoptedTree[]>([]);
  const [historialRiegos, setHistorialRiegos] = useState<Riego[]>([]);

  // ✅ Cargar datos desde backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Créditos actualizados
        const userRes = await fetch(`http://localhost:4000/api/usuarios/${user._id}`);
        const userData = await userRes.json();
        if (userRes.ok && userData?.puntostotales !== undefined) {
          setRealCredits(userData.puntostotales);
        }

        // Árboles adoptados
        const treesRes = await fetch(`http://localhost:4000/api/planta`);
        const allTrees = await treesRes.json();
        const myTrees = allTrees.filter((t: any) => t.adoptante === user._id);
        setAdoptedTrees(myTrees);

        // Historial de riegos completados
        const riegoRes = await fetch(`http://localhost:4000/api/tecnico/historial/${user._id}`);
        if (riegoRes.ok) {
          const riegoData = await riegoRes.json();
          setHistorialRiegos(riegoData);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [user._id]);

  // 🔔 Notificaciones automáticas cada 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const notifRes = await fetch(`http://localhost:4000/api/tecnico/notificaciones/${user._id}`);
        const data = await notifRes.json();
        if (data.success && data.nuevas.length > 0) {
          data.nuevas.forEach((r: any) =>
            toast.success(`Tu árbol "${r.treeName}" fue regado por ${r.technicianName}`)
          );
        }
      } catch {
        /* evitar spam de errores */
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user._id]);

  // 🎖️ Logros dinámicos
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Primera Adopción",
      description: "Adoptaste tu primer árbol",
      unlocked: adoptedTrees.length >= 1,
    },
    {
      id: "2",
      title: "Amante de la Naturaleza",
      description: "Has solicitado riegos para tus árboles",
      unlocked: historialRiegos.length >= 1,
    },
    {
      id: "3",
      title: "Coleccionista Verde",
      description: "Adopta 5 árboles diferentes",
      unlocked: adoptedTrees.length >= 5,
    },
  ];

  const getHealthColor = (estado: string) => {
    switch (estado) {
      case "available":
        return "bg-green-100 text-green-700";
      case "adopted":
        return "bg-blue-100 text-blue-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 🧑 Perfil */}
        <Card className="mb-8 shadow-md border">
          <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="text-2xl bg-green-100 text-green-600">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-green-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
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

            <Button
              variant="outline"
              onClick={() => onNavigate("credits")}
              className="flex items-center gap-2"
            >
              <Coins className="h-4 w-4" />
              Comprar Créditos
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="trees">🌳 Mis Árboles</TabsTrigger>
            <TabsTrigger value="riegos">💧 Riegos</TabsTrigger>
            <TabsTrigger value="achievements">🏆 Logros</TabsTrigger>
          </TabsList>

          {/* 🌳 Árboles Adoptados */}
          <TabsContent value="trees">
            {adoptedTrees.length === 0 ? (
              <p className="text-gray-600 text-center mt-6">No has adoptado ningún árbol 🌱</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {adoptedTrees.map((tree) => (
                  <Card key={tree._id} className="shadow-sm hover:shadow-md transition">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={
                          tree.imagen
                            ? `http://localhost:4000/uploads/${tree.imagen}`
                            : "https://placehold.co/600x400?text=Árbol"
                        }
                        alt={tree.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-900">{tree.nombre}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-600">{tree.especie}</p>
                      <Badge className={getHealthColor(tree.estadoactual || "")}>
                        {tree.estadoactual === "adopted" ? "Adoptado" : "Disponible"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          localStorage.setItem("selectedTree", JSON.stringify(tree));
                          onNavigate("map");
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Ver en Mapa
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 💧 Historial de Riegos */}
          <TabsContent value="riegos">
            {historialRiegos.length === 0 ? (
              <p className="text-gray-600 text-center mt-6">
                Aún no se ha realizado ningún riego 🌿
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {historialRiegos.map((r) => (
                  <Card key={r._id} className="shadow-sm">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={
                          r.photoEvidence
                            ? `http://localhost:4000/uploads/riegos/${r.photoEvidence}`
                            : "https://placehold.co/600x400?text=Riego"
                        }
                        alt="Evidencia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-900">{r.treeName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <Droplets className="inline-block w-4 h-4 mr-1 text-blue-500" />
                        {r.treeCondition || "Sin estado"}
                      </p>
                      <p className="text-sm text-gray-500 italic">
                        Técnico: {r.technicianName || "Desconocido"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.completedAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 🏆 Logros */}
          <TabsContent value="achievements">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {achievements.map((a) => (
                <Card
                  key={a.id}
                  className={`border-2 ${
                    a.unlocked ? "border-green-500" : "border-gray-200"
                  } transition`}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <Award
                      className={`mx-auto w-8 h-8 ${
                        a.unlocked ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                    <h3 className="font-semibold text-green-900">{a.title}</h3>
                    <p className="text-sm text-gray-600">{a.description}</p>
                    {a.unlocked ? (
                      <Badge className="bg-green-100 text-green-700">Desbloqueado</Badge>
                    ) : (
                      <Badge variant="secondary">Bloqueado</Badge>
                    )}
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
