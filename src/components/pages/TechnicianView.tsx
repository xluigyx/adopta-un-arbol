import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  TreePine, Droplets, CheckCircle, AlertTriangle, Calendar, 
  Camera, MapPin, FileText, Map
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
    name: string;
    role: string;
  };
}

export function TechnicianView({ onNavigate, user }: TechnicianViewProps) {
  const [activeTab, setActiveTab] = useState('watering');
  const [showWateringForm, setShowWateringForm] = useState(false);
  const [selectedWateringTask, setSelectedWateringTask] = useState<WateringRequest | null>(null);
  const [selectedTree, setSelectedTree] = useState<AssignedTree | null>(null);

  const [reportData, setReportData] = useState({
    health: '',
    notes: '',
    nextAction: ''
  });

  const [assignedTrees, setAssignedTrees] = useState<AssignedTree[]>([
    {
      id: '1',
      name: 'Roble del Parque',
      species: 'Quercus robur',
      location: 'Parque Central - Sector A',
      health: 'good',
      lastMaintenance: '2024-08-15',
      nextMaintenance: '2024-09-15',
      adopter: 'Familia García',
      plantedDate: '2024-01-10',
      instructions: [
        'Regar 2 veces por semana',
        'Revisar por plagas mensualmente',
        'Podar ramas secas cuando sea necesario'
      ],
      image: 'https://images.unsplash.com/photo-1605245136640-05b9ae766b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: '2',
      name: 'Cerezo de la Plaza',
      species: 'Prunus serrulata',
      location: 'Plaza Norte - Entrada Principal',
      health: 'fair',
      lastMaintenance: '2024-08-20',
      nextMaintenance: '2024-09-12',
      adopter: 'Carlos López',
      plantedDate: '2024-02-28',
      instructions: [
        'Necesita tratamiento para pulgones',
        'Regar abundantemente',
        'Aplicar fertilizante orgánico'
      ],
      image: 'https://images.unsplash.com/photo-1526344966-89049886b28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    }
  ]);

  const [wateringRequests, setWateringRequests] = useState<WateringRequest[]>([
    {
      id: '1',
      treeId: '3',
      treeName: 'Jacarandá de la Avenida',
      location: 'Avenida Principal',
      requesterName: 'Ana Rodríguez',
      requesterEmail: 'ana@email.com',
      urgency: 'high',
      requestDate: '2024-09-11',
      dueDate: '2024-09-13',
      status: 'assigned',
      notes: 'El árbol se ve seco, necesita riego urgente',
      specialInstructions: 'Revisar sistema de drenaje, puede tener problema'
    },
    {
      id: '2',
      treeId: '4',
      treeName: 'Magnolia del Boulevard',
      location: 'Boulevard Norte',
      requesterName: 'Pedro Martínez',
      requesterEmail: 'pedro@email.com',
      urgency: 'medium',
      requestDate: '2024-09-12',
      dueDate: '2024-09-15',
      status: 'assigned',
      notes: 'Riego programado mensual',
      specialInstructions: 'Aplicar riego profundo, es época de sequía'
    },
    {
      id: '3',
      treeId: '5',
      treeName: 'Fresno del Parque',
      location: 'Parque Sur',
      requesterName: 'Luisa Fernández',
      requesterEmail: 'luisa@email.com',
      urgency: 'low',
      requestDate: '2024-09-10',
      dueDate: '2024-09-17',
      status: 'completed',
      notes: 'Mantenimiento regular',
      specialInstructions: 'Verificar hojas por signos de enfermedad'
    }
  ]);

  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      treeId: '2',
      treeName: 'Cerezo de la Plaza',
      type: 'treatment',
      priority: 'high',
      dueDate: '2024-09-12',
      status: 'pending',
      description: 'Aplicar tratamiento para control de pulgones'
    },
    {
      id: '2',
      treeId: '1',
      treeName: 'Roble del Parque',
      type: 'watering',
      priority: 'medium',
      dueDate: '2024-09-13',
      status: 'pending',
      description: 'Riego programado semanal'
    }
  ]);

  // --- Helpers para colores y textos ---
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-700 bg-green-100';
      case 'good': return 'text-green-600 bg-green-50';
      case 'fair': return 'text-yellow-700 bg-yellow-100';
      case 'poor': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'watering': return <Droplets className="h-4 w-4 text-blue-600" />;
      case 'pruning': return <CheckCircle className="h-4 w-4 text-orange-600" />;
      case 'inspection': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'treatment': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <TreePine className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return urgency;
    }
  };

  const getWateringStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-blue-700 bg-blue-100';
      case 'in-progress': return 'text-yellow-700 bg-yellow-100';
      case 'completed': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getWateringStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'Asignado';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  // --- Acciones ---
  const updateWateringStatus = (requestId: string, newStatus: 'assigned' | 'in-progress' | 'completed') => {
    setWateringRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
  };

  const startWateringTask = (requestId: string) => {
    updateWateringStatus(requestId, 'in-progress');
  };

  const completeWateringTask = (requestId: string) => {
    const request = wateringRequests.find(r => r.id === requestId);
    if (request) {
      setSelectedWateringTask(request);
      setShowWateringForm(true);
    }
  };

  const handleWateringReportSubmit = (report: any) => {
    updateWateringStatus(report.taskId, 'completed');
    setShowWateringForm(false);
    setSelectedWateringTask(null);
    alert('¡Reporte de riego enviado exitosamente!');
  };

  const handleWateringReportCancel = () => {
    setShowWateringForm(false);
    setSelectedWateringTask(null);
  };

  const completeTask = (taskId: string) => {
    setMaintenanceTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: 'completed' } : task
      )
    );
  };

  const updateTreeHealth = (treeId: string, newHealth: 'excellent' | 'good' | 'fair' | 'poor') => {
    setAssignedTrees(prev =>
      prev.map(tree =>
        tree.id === treeId ? { ...tree, health: newHealth } : tree
      )
    );
  };

  const submitReport = () => {
    if (selectedTree && reportData.health) {
      updateTreeHealth(selectedTree.id, reportData.health as any);
      setReportData({ health: '', notes: '', nextAction: '' });
      setSelectedTree(null);
      alert('Reporte enviado correctamente');
    }
  };

  const pendingWateringRequests = wateringRequests.filter(r => r.status === 'assigned' || r.status === 'in-progress');
  const urgentTasks = wateringRequests.filter(r => r.urgency === 'high' && r.status !== 'completed').length;

  // --- Mostrar formulario de reporte si aplica ---
  if (showWateringForm && selectedWateringTask) {
    return (
      <WateringReportForm
        task={selectedWateringTask}
        onSubmit={handleWateringReportSubmit}
        onCancel={handleWateringReportCancel}
      />
    );
  }

  // --- Render principal ---
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header y estadísticas */}
        {/* ... (igual que tu código original, puedes mantenerlo) */}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="watering">Solicitudes de Riego</TabsTrigger>
            <TabsTrigger value="assigned">Mis Árboles</TabsTrigger>
            <TabsTrigger value="tasks">Otras Tareas</TabsTrigger>
          </TabsList>

          {/* Contenido de tabs */}
          {/* ... mantener igual, solo modificar Select y Textarea con tipos correctos: */}
          <TabsContent value="reports">
            {selectedTree && (
              <Select
                value={reportData.health}
                onValueChange={(value: string) =>
                  setReportData(prev => ({ ...prev, health: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excelente</SelectItem>
                  <SelectItem value="good">Bueno</SelectItem>
                  <SelectItem value="fair">Regular</SelectItem>
                  <SelectItem value="poor">Malo</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Textarea
              value={reportData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReportData(prev => ({ ...prev, notes: e.target.value }))
              }
            />
            <Textarea
              value={reportData.nextAction}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReportData(prev => ({ ...prev, nextAction: e.target.value }))
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
