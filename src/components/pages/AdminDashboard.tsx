import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users, TreePine, DollarSign, CheckCircle, XCircle, Clock, 
  TrendingUp, AlertTriangle, Eye, Droplets, UserCheck, Shield
} from 'lucide-react';

interface AdoptionRequest {
  id: string;
  userName: string;
  userEmail: string;
  treeName: string;
  treeSpecies: string;
  location: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  credits: number;
}

interface WateringRequest {
  id: string;
  userName: string;
  userEmail: string;
  treeName: string;
  location: string;
  requestDate: string;
  status: 'pending' | 'assigned' | 'completed';
  assignedTechnician?: string;
  urgency: 'low' | 'medium' | 'high';
  notes: string;
}

interface PaymentRequest {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  credits: number;
  method: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'technician' | 'admin';
  joinDate: string;
  credits: number;
  assignedTrees?: number;
  isActive: boolean;
}

interface Payment {
  id: string;
  userName: string;
  amount: number;
  credits: number;
  method: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([
    {
      id: '1',
      userName: 'María García',
      userEmail: 'maria@email.com',
      treeName: 'Roble del Parque',
      treeSpecies: 'Quercus robur',
      location: 'Parque Central',
      requestDate: '2024-09-10',
      status: 'pending',
      credits: 1
    },
    {
      id: '2',
      userName: 'Carlos López',
      userEmail: 'carlos@email.com',
      treeName: 'Cerezo de la Plaza',
      treeSpecies: 'Prunus serrulata',
      location: 'Plaza Norte',
      requestDate: '2024-09-09',
      status: 'pending',
      credits: 1
    }
  ]);

  const [wateringRequests, setWateringRequests] = useState<WateringRequest[]>([
    {
      id: '1',
      userName: 'Ana Rodríguez',
      userEmail: 'ana@email.com',
      treeName: 'Jacarandá de la Avenida',
      location: 'Avenida Principal',
      requestDate: '2024-09-11',
      status: 'pending',
      urgency: 'high',
      notes: 'El árbol se ve seco, necesita riego urgente'
    },
    {
      id: '2',
      userName: 'Pedro Martínez',
      userEmail: 'pedro@email.com',
      treeName: 'Magnolia del Boulevard',
      location: 'Boulevard Norte',
      requestDate: '2024-09-12',
      status: 'pending',
      urgency: 'medium',
      notes: 'Riego programado mensual'
    }
  ]);

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([
    {
      id: '1',
      userName: 'Lucía Torres',
      userEmail: 'lucia@email.com',
      amount: 25,
      credits: 50,
      method: 'Tarjeta de Crédito',
      requestDate: '2024-09-13',
      status: 'pending'
    },
    {
      id: '2',
      userName: 'Roberto Silva',
      userEmail: 'roberto@email.com',
      amount: 15,
      credits: 30,
      method: 'PayPal',
      requestDate: '2024-09-12',
      status: 'pending'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Técnico',
      email: 'juan@arbolitos.org',
      role: 'technician',
      joinDate: '2023-03-20',
      credits: 25,
      assignedTrees: 12,
      isActive: true
    },
    {
      id: '2',
      name: 'María Técnico',
      email: 'maria.tech@arbolitos.org',
      role: 'technician',
      joinDate: '2023-05-15',
      credits: 30,
      assignedTrees: 8,
      isActive: true
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@email.com',
      role: 'user',
      joinDate: '2024-01-10',
      credits: 15,
      isActive: true
    },
    {
      id: '4',
      name: 'Ana Rodríguez',
      email: 'ana@email.com',
      role: 'user',
      joinDate: '2024-02-20',
      credits: 8,
      isActive: true
    }
  ]);

  const payments: Payment[] = [
    {
      id: '1',
      userName: 'Ana Rodríguez',
      amount: 18,
      credits: 50,
      method: 'Tarjeta',
      date: '2024-09-10',
      status: 'completed'
    },
    {
      id: '2',
      userName: 'Pedro Martínez',
      amount: 10,
      credits: 25,
      method: 'PayPal',
      date: '2024-09-09',
      status: 'completed'
    }
  ];

  const stats = {
    totalUsers: users.length,
    totalTechnicians: users.filter(u => u.role === 'technician').length,
    totalTrees: 2450,
    totalRevenue: 15680,
    pendingRequests: adoptionRequests.filter(r => r.status === 'pending').length + 
                    wateringRequests.filter(r => r.status === 'pending').length +
                    paymentRequests.filter(r => r.status === 'pending').length,
    monthlyGrowth: 12.5,
    adoptionRate: 89.2,
    userSatisfaction: 96.8
  };

  const handleAdoptionRequest = (requestId: string, action: 'approve' | 'reject') => {
    setAdoptionRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
          : request
      )
    );
  };

  const handlePaymentRequest = (requestId: string, action: 'approve' | 'reject') => {
    setPaymentRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
          : request
      )
    );
  };

  const assignTechnicianToWatering = (requestId: string, technicianId: string) => {
    const technician = users.find(u => u.id === technicianId);
    setWateringRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'assigned', assignedTechnician: technician?.name }
          : request
      )
    );
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isActive: !user.isActive }
          : user
      )
    );
  };

  const changeUserRole = (userId: string, newRole: 'user' | 'technician' | 'admin') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      )
    );
  };

  const availableTechnicians = users.filter(u => u.role === 'technician' && u.isActive);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      case 'assigned': return 'Asignado';
      case 'completed': return 'Completado';
      case 'failed': return 'Fallido';
      default: return status;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'technician': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'technician': return 'Técnico';
      case 'user': return 'Usuario';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona usuarios, adopciones y estadísticas del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solicitudes Pendientes</p>
                  <p className="text-2xl font-bold text-green-900">{stats.pendingRequests}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-yellow-600">Requieren atención</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Técnicos Activos</p>
                  <p className="text-2xl font-bold text-green-900">{stats.totalTechnicians}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-blue-600">Disponibles para asignación</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuarios Totales</p>
                  <p className="text-2xl font-bold text-green-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">Sistema activo</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-600">Este año</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
            <TabsTrigger value="watering">Riego</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Nueva adopción aprobada</p>
                        <p className="text-xs text-gray-500">Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Técnico asignado a riego urgente</p>
                        <p className="text-xs text-gray-500">Hace 3 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Nueva solicitud de pago</p>
                        <p className="text-xs text-gray-500">Hace 4 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Nuevo técnico registrado</p>
                        <p className="text-xs text-gray-500">Hace 6 horas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Solicitudes Procesadas</span>
                        <span>87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Técnicos Activos</span>
                        <span>{stats.totalTechnicians}/{stats.totalTechnicians + 1}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Satisfacción de Usuarios</span>
                        <span>{stats.userSatisfaction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-700 h-2 rounded-full" style={{ width: `${stats.userSatisfaction}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Adopción</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Árbol</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adoptionRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.userName}</p>
                            <p className="text-sm text-gray-500">{request.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.treeName}</p>
                            <p className="text-sm text-gray-500 italic">{request.treeSpecies}</p>
                          </div>
                        </TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAdoptionRequest(request.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAdoptionRequest(request.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </div>
                          )}
                          {request.status !== 'pending' && (
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watering">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Solicitudes de Riego
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Árbol</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Urgencia</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Técnico Asignado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wateringRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.userName}</p>
                            <p className="text-sm text-gray-500">{request.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.treeName}</p>
                            <p className="text-xs text-gray-500">{request.notes}</p>
                          </div>
                        </TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency === 'high' ? 'Alta' : 
                             request.urgency === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.assignedTechnician || 'Sin asignar'}
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <Select onValueChange={(technicianId) => assignTechnicianToWatering(request.id, technicianId)}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Asignar técnico" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTechnicians.map((tech) => (
                                  <SelectItem key={tech.id} value={tech.id}>
                                    {tech.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {request.status !== 'pending' && (
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitudes de Pago Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Créditos</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{request.userName}</p>
                              <p className="text-sm text-gray-500">{request.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>${request.amount}</TableCell>
                          <TableCell>{request.credits}</TableCell>
                          <TableCell>{request.method}</TableCell>
                          <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusText(request.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handlePaymentRequest(request.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handlePaymentRequest(request.id, 'reject')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rechazar
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historial de Pagos Completados</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Créditos</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.userName}</p>
                            </div>
                          </TableCell>
                          <TableCell>${payment.amount}</TableCell>
                          <TableCell>{payment.credits}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(payment.status)}>
                              {getStatusText(payment.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Fecha de Registro</TableHead>
                      <TableHead>Créditos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleText(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>{user.credits}</TableCell>
                        <TableCell>
                          <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.isActive ? 'Desactivar' : 'Activar'}
                            </Button>
                            <Select onValueChange={(newRole) => changeUserRole(user.id, newRole as 'user' | 'technician' | 'admin')}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Cambiar rol" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Usuario</SelectItem>
                                <SelectItem value="technician">Técnico</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}