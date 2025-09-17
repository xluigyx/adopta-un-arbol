import { useState } from 'react';
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
    name: string;
    role: string;
  };
}

export function TechnicianView({ onNavigate, user }: TechnicianViewProps) {
  const [activeTab, setActiveTab] = useState('watering');
  const [showWateringForm, setShowWateringForm] = useState(false);
  const [selectedWateringTask, setSelectedWateringTask] = useState<WateringRequest | null>(null);
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
      image: 'https://images.unsplash.com/photo-1605245136640-05b9ae766b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB0cmVlJTIwbWF0dXJlfGVufDF8fHx8MTc1NzcyNTUyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
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
      image: 'https://images.unsplash.com/photo-1526344966-89049886b28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwdHJlZXxlbnwxfHx8fDE3NTc3MjU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080'
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

  const [selectedTree, setSelectedTree] = useState<AssignedTree | null>(null);
  const [reportData, setReportData] = useState({
    health: '',
    notes: '',
    nextAction: ''
  });

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
      case 'pruning': return <Wrench className="h-4 w-4 text-orange-600" />;
      case 'inspection': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'treatment': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <TreePine className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTaskTypeText = (type: string) => {
    switch (type) {
      case 'watering': return 'Riego';
      case 'pruning': return 'Poda';
      case 'inspection': return 'Inspección';
      case 'treatment': return 'Tratamiento';
      default: return type;
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
    // Update the request status to completed
    updateWateringStatus(report.taskId, 'completed');
    
    // Close the form
    setShowWateringForm(false);
    setSelectedWateringTask(null);
    
    // Show success message
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

  const updateTreeHealth = (treeId: string, newHealth: string) => {
    setAssignedTrees(prev =>
      prev.map(tree =>
        tree.id === treeId ? { ...tree, health: newHealth as any } : tree
      )
    );
  };

  const submitReport = () => {
    if (selectedTree && reportData.health) {
      updateTreeHealth(selectedTree.id, reportData.health);
      setReportData({ health: '', notes: '', nextAction: '' });
      setSelectedTree(null);
      alert('Reporte enviado correctamente');
    }
  };

  const pendingWateringRequests = wateringRequests.filter(r => r.status === 'assigned' || r.status === 'in-progress');
  const urgentTasks = wateringRequests.filter(r => r.urgency === 'high' && r.status !== 'completed').length;

  // Show watering report form if selected
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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-900 mb-2">Panel de Técnico - {user.name}</h1>
              <p className="text-gray-600">Gestiona las solicitudes de riego y mantenimiento asignadas</p>
            </div>
            <Button 
              onClick={() => onNavigate('map')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Map className="mr-2 h-4 w-4" />
              Ver Mapa
            </Button>
          </div>
        </div>

        {/* Simple Stats Cards - Only essential information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{pendingWateringRequests.length}</div>
              <div className="text-sm text-gray-600">Riegos Pendientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{urgentTasks}</div>
              <div className="text-sm text-gray-600">Urgentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{assignedTrees.length}</div>
              <div className="text-sm text-gray-600">Árboles Asignados</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="watering">Solicitudes de Riego</TabsTrigger>
            <TabsTrigger value="assigned">Mis Árboles</TabsTrigger>
            <TabsTrigger value="tasks">Otras Tareas</TabsTrigger>
          </TabsList>

          <TabsContent value="watering" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    Solicitudes de Riego Asignadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wateringRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className={`p-4 border rounded-lg ${
                          request.status === 'completed' ? 'bg-green-50 border-green-200' : 
                          request.urgency === 'high' ? 'bg-red-50 border-red-200' :
                          'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-green-900">{request.treeName}</h3>
                              <Badge className={getUrgencyColor(request.urgency)}>
                                {getUrgencyText(request.urgency)}
                              </Badge>
                              <Badge className={getWateringStatusColor(request.status)}>
                                {getWateringStatusText(request.status)}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  <MapPin className="h-4 w-4 inline mr-1" />
                                  {request.location}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="font-medium">Solicitado por:</span> {request.requesterName}
                                </p>
                                <p className="text-xs text-gray-500">{request.requesterEmail}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  <Calendar className="h-4 w-4 inline mr-1" />
                                  <span className="font-medium">Fecha límite:</span> {new Date(request.dueDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Solicitado:</span> {new Date(request.requestDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-3">
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm font-medium text-gray-900 mb-1">Notas del solicitante:</p>
                                <p className="text-sm text-gray-600">{request.notes}</p>
                              </div>
                              
                              {request.specialInstructions && (
                                <div className="bg-blue-50 p-3 rounded">
                                  <p className="text-sm font-medium text-blue-900 mb-1">Instrucciones especiales:</p>
                                  <p className="text-sm text-blue-700">{request.specialInstructions}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="ml-4 flex flex-col gap-2">
                            {request.status === 'assigned' && (
                              <Button 
                                size="sm"
                                onClick={() => startWateringTask(request.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Iniciar Riego
                              </Button>
                            )}
                            {request.status === 'in-progress' && (
                              <Button 
                                size="sm"
                                onClick={() => completeWateringTask(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <FileText className="mr-1 h-4 w-4" />
                                Completar con Reporte
                              </Button>
                            )}
                            {request.status === 'completed' && (
                              <Badge className="bg-green-100 text-green-800">
                                ✓ Completado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assigned" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedTrees.map((tree) => (
                <Card key={tree.id} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{tree.location}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adoptado por:</span>
                        <span>{tree.adopter || 'Sin adoptar'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Último mantenimiento:</span>
                        <span>{new Date(tree.lastMaintenance).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Próximo mantenimiento:</span>
                        <span className="font-medium">
                          {new Date(tree.nextMaintenance).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Instrucciones:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tree.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-green-600">•</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedTree(tree)}
                      >
                        <FileText className="mr-1 h-3 w-3" />
                        Reportar
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Camera className="mr-1 h-3 w-3" />
                        Foto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Otras Tareas de Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-4 border rounded-lg ${
                        task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTaskTypeIcon(task.type)}
                            <h3 className="font-semibold text-green-900">
                              {getTaskTypeText(task.type)} - {task.treeName}
                            </h3>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority === 'high' ? 'Alta' : 
                               task.priority === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Vence: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                              {task.status === 'completed' ? 'Completada' : 
                               task.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                            </Badge>
                          </div>
                        </div>
                        
                        {task.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => completeTask(task.id)}
                            className="ml-4"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Completar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Reporte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTree ? (
                    <>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-900">{selectedTree.name}</h3>
                        <p className="text-sm text-gray-600">{selectedTree.location}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Estado de Salud</label>
                        <Select value={reportData.health} onValueChange={(value) => 
                          setReportData(prev => ({ ...prev, health: value }))
                        }>
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
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Observaciones</label>
                        <Textarea
                          placeholder="Describe el estado del árbol, cualquier problema observado, etc."
                          value={reportData.notes}
                          onChange={(e) => 
                            setReportData(prev => ({ ...prev, notes: e.target.value }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Próxima Acción Recomendada</label>
                        <Textarea
                          placeholder="Describe las acciones necesarias para el próximo mantenimiento"
                          value={reportData.nextAction}
                          onChange={(e) => 
                            setReportData(prev => ({ ...prev, nextAction: e.target.value }))
                          }
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={submitReport} className="flex-1">
                          Enviar Reporte
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedTree(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Selecciona un Árbol
                      </h3>
                      <p className="text-gray-500">
                        Ve a la pestaña "Asignadas" y haz clic en "Reportar" para crear un reporte
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historial de Reportes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-green-900">Roble del Parque</h4>
                        <span className="text-sm text-gray-500">15/08/2024</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Estado: Bueno</p>
                      <p className="text-xs text-gray-500">
                        Árbol en buen estado general. Se aplicó riego y se removieron hojas secas.
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-green-900">Cerezo de la Plaza</h4>
                        <span className="text-sm text-gray-500">10/08/2024</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Estado: Regular</p>
                      <p className="text-xs text-gray-500">
                        Se detectó presencia de pulgones. Se recomienda tratamiento especializado.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}