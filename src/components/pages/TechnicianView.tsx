import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  TreePine, Droplets, CheckCircle, AlertTriangle, Clock, 
  Camera, MapPin, FileText, Calendar, Wrench, Map
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { WateringReportForm } from './WateringReportForm';

interface AssignedTree {
  id: string;
  name: string;
  species: string;
  location: string;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance: string;
  nextMaintenance: string;
  adopter?: string;
  plantedDate: string;
  instructions: string[];
  image: string;
}

interface WateringRequest {
  id: string;
  treeId: string;
  treeName: string;
  location: string;
  requesterName: string;
  requesterEmail: string;
  urgency: 'low' | 'medium' | 'high';
  requestDate: string;
  dueDate: string;
  status: 'assigned' | 'in-progress' | 'completed';
  notes: string;
  specialInstructions?: string;
}

interface MaintenanceTask {
  id: string;
  treeId: string;
  treeName: string;
  type: 'watering' | 'pruning' | 'inspection' | 'treatment';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
}

interface TechnicianViewProps {
  onNavigate: (view: string) => void;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export function TechnicianView({ onNavigate, user }: TechnicianViewProps) {
  const [activeTab, setActiveTab] = useState('watering');
  const [showWateringForm, setShowWateringForm] = useState(false);
  const [selectedWateringTask, setSelectedWateringTask] = useState<WateringRequest | null>(null);
  const [assignedTrees, setAssignedTrees] = useState<AssignedTree[]>([]);
  const [wateringRequests, setWateringRequests] = useState<WateringRequest[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [selectedTree, setSelectedTree] = useState<AssignedTree | null>(null);
  const [reportData, setReportData] = useState({
    health: '',
    notes: '',
    nextAction: ''
  });

  // 🔗 Cargar datos del backend
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:4000/api/tecnico/arboles/${user.id}`)
      .then(res => res.json())
      .then(data => setAssignedTrees(data))
      .catch(err => console.error("Error al cargar árboles:", err));

    fetch(`http://localhost:4000/api/tecnico/riegos/${user.id}`)
      .then(res => res.json())
      .then(data => setWateringRequests(data))
      .catch(err => console.error("Error al cargar riegos:", err));

    // Las otras tareas podrías cargarlas desde otro endpoint
    setMaintenanceTasks([]);
  }, [user]);

  // 🔗 Actualizar estado de riego en el backend
  const updateWateringStatus = async (
    requestId: string,
    newStatus: 'assigned' | 'in-progress' | 'completed',
    notes?: string
  ) => {
    try {
      const res = await fetch(`http://localhost:4000/api/tecnico/riegos/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes })
      });
      const updated = await res.json();
      setWateringRequests(prev =>
        prev.map(r => (r.id === requestId ? updated : r))
      );
    } catch (err) {
      console.error("Error actualizando riego:", err);
    }
  };

  // 🔗 Enviar reporte al backend
  const submitReport = async () => {
    if (selectedTree && reportData.health) {
      try {
        const res = await fetch("http://localhost:4000/api/tecnico/reportes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idplanta: selectedTree.id,
            idusuario: user.id,
            estado: reportData.health,
            notas: reportData.notes,
            proximaAccion: reportData.nextAction
          })
        });
        if (res.ok) {
          alert("Reporte enviado correctamente ✅");
          setReportData({ health: "", notes: "", nextAction: "" });
          setSelectedTree(null);
        }
      } catch (err) {
        console.error("Error al enviar reporte:", err);
      }
    }
  };

  const startWateringTask = (id: string) => updateWateringStatus(id, "in-progress");
  const completeWateringTask = (id: string) => {
    const req = wateringRequests.find(r => r.id === id);
    if (req) {
      setSelectedWateringTask(req);
      setShowWateringForm(true);
    }
  };

  const handleWateringReportSubmit = (report: any) => {
    updateWateringStatus(report.taskId, "completed", report.notes);
    setShowWateringForm(false);
    setSelectedWateringTask(null);
    alert("¡Reporte de riego enviado exitosamente!");
  };

  const handleWateringReportCancel = () => {
    setShowWateringForm(false);
    setSelectedWateringTask(null);
  };

  // Helpers UI
  const getHealthColor = (h: string) =>
    h === "excellent" ? "text-green-700 bg-green-100" :
    h === "good" ? "text-green-600 bg-green-50" :
    h === "fair" ? "text-yellow-700 bg-yellow-100" :
    h === "poor" ? "text-red-700 bg-red-100" : "text-gray-700 bg-gray-100";

  const getHealthText = (h: string) =>
    h === "excellent" ? "Excelente" :
    h === "good" ? "Bueno" :
    h === "fair" ? "Regular" :
    h === "poor" ? "Malo" : h;

  const getUrgencyColor = (u: string) =>
    u === "high" ? "text-red-700 bg-red-100" :
    u === "medium" ? "text-yellow-700 bg-yellow-100" :
    u === "low" ? "text-green-700 bg-green-100" : "text-gray-700 bg-gray-100";

  const getUrgencyText = (u: string) =>
    u === "high" ? "Alta" : u === "medium" ? "Media" : "Baja";

  const getWateringStatusColor = (s: string) =>
    s === "assigned" ? "text-blue-700 bg-blue-100" :
    s === "in-progress" ? "text-yellow-700 bg-yellow-100" :
    s === "completed" ? "text-green-700 bg-green-100" : "text-gray-700 bg-gray-100";

  const getWateringStatusText = (s: string) =>
    s === "assigned" ? "Asignado" :
    s === "in-progress" ? "En Progreso" :
    s === "completed" ? "Completado" : s;

  const pendingWateringRequests = wateringRequests.filter(r => r.status !== "completed");
  const urgentTasks = wateringRequests.filter(r => r.urgency === "high" && r.status !== "completed").length;

  // Mostrar formulario de reporte de riego
  if (showWateringForm && selectedWateringTask) {
    return (
      <WateringReportForm
        task={selectedWateringTask}
        onSubmit={handleWateringReportSubmit}
        onCancel={handleWateringReportCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">Panel de Técnico - {user.name}</h1>
            <p className="text-gray-600">Gestiona las solicitudes de riego y mantenimiento asignadas</p>
          </div>
          <Button onClick={() => onNavigate("map")} className="bg-green-600 hover:bg-green-700">
            <Map className="mr-2 h-4 w-4" /> Ver Mapa
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card><CardContent className="p-6 text-center">
            <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{pendingWateringRequests.length}</div>
            <div className="text-sm text-gray-600">Riegos Pendientes</div>
          </CardContent></Card>

          <Card><CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{urgentTasks}</div>
            <div className="text-sm text-gray-600">Urgentes</div>
          </CardContent></Card>

          <Card><CardContent className="p-6 text-center">
            <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{assignedTrees.length}</div>
            <div className="text-sm text-gray-600">Árboles Asignados</div>
          </CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="watering">Solicitudes de Riego</TabsTrigger>
            <TabsTrigger value="assigned">Mis Árboles</TabsTrigger>
            <TabsTrigger value="tasks">Otras Tareas</TabsTrigger>
          </TabsList>

          {/* Tab: Riegos */}
          <TabsContent value="watering">
            <Card>
              <CardHeader><CardTitle>Solicitudes de Riego Asignadas</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {wateringRequests.map(req => (
                  <div key={req.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-green-900">{req.treeName}</h3>
                        <Badge className={getUrgencyColor(req.urgency)}>{getUrgencyText(req.urgency)}</Badge>
                        <Badge className={getWateringStatusColor(req.status)}>{getWateringStatusText(req.status)}</Badge>
                        <p className="text-sm text-gray-600 mt-2"><MapPin className="inline h-4 w-4 mr-1" /> {req.location}</p>
                        <p className="text-sm text-gray-600">Solicitado por: {req.requesterName}</p>
                        <p className="text-xs text-gray-500">{req.requesterEmail}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {req.status === "assigned" && (
                          <Button size="sm" className="bg-blue-600" onClick={() => startWateringTask(req.id)}>Iniciar</Button>
                        )}
                        {req.status === "in-progress" && (
                          <Button size="sm" className="bg-green-600" onClick={() => completeWateringTask(req.id)}>Completar</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Árboles */}
          <TabsContent value="assigned">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedTrees.map(tree => (
                <Card key={tree.id}>
                  <div className="aspect-video">
                    <ImageWithFallback src={tree.image} alt={tree.name} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{tree.name}</CardTitle>
                    <Badge className={getHealthColor(tree.health)}>{getHealthText(tree.health)}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{tree.location}</p>
                    <Button size="sm" variant="outline" onClick={() => setSelectedTree(tree)}>Reportar</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Otras tareas */}
          <TabsContent value="tasks">
            {maintenanceTasks.length === 0 && (
              <p className="text-gray-600">No hay tareas adicionales asignadas</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
