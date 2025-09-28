import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users, DollarSign, CheckCircle, XCircle, Clock, 
  TrendingUp, AlertTriangle, Eye, Droplets, UserCheck
} from 'lucide-react';

interface AdoptionRequest {
  _id: string;
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
  _id: string;
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
  _id: string;
  userName: string;
  userEmail: string;
  amount: number;
  credits: number;
  method: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  _id: string;
  nombre: string;
  correo: string;
  rol: string;
  joinDate?: string;
  puntostotales: number;
  isActive?: boolean;
}

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState<User[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [wateringRequests, setWateringRequests] = useState<WateringRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);

  // 🔹 Cargar datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await fetch('http://localhost:4000/api/admin/users');
        const dataUsers = await resUsers.json();
        setUsers(dataUsers);

        const resAdoptions = await fetch('http://localhost:4000/api/admin/adoption-requests');
        const dataAdoptions = await resAdoptions.json();
        setAdoptionRequests(dataAdoptions);

        const resPayments = await fetch('http://localhost:4000/api/admin/payments');
        const dataPayments = await resPayments.json();
        setPaymentRequests(dataPayments);

        const resWatering = await fetch('http://localhost:4000/api/admin/watering-requests');
        const dataWatering = await resWatering.json();
        setWateringRequests(dataWatering);
      } catch (err) {
        console.error('❌ Error cargando datos del admin:', err);
      }
    };

    fetchData();
  }, []);

  // 📊 Stats rápidos
  const stats = {
    totalUsers: users.length,
    totalTechnicians: users.filter(u => u.rol?.toLowerCase() === 'técnico').length,
    totalRevenue: paymentRequests.reduce((acc, p) => acc + (p.status === 'approved' ? p.amount : 0), 0),
    pendingRequests:
      adoptionRequests.filter(r => r.status === 'pending').length +
      wateringRequests.filter(r => r.status === 'pending').length +
      paymentRequests.filter(r => r.status === 'pending').length,
  };

  // 🔹 Helpers UI
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
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
      default: return status;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrador': return 'bg-purple-100 text-purple-800';
      case 'técnico': return 'bg-blue-100 text-blue-800';
      case 'cliente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrador': return 'Administrador';
      case 'técnico': return 'Técnico';
      case 'cliente': return 'Usuario';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona usuarios, adopciones, riegos y pagos en el sistema</p>
        </div>

        {/* 🔹 Stats Cards */}
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
                  <p className="text-sm text-gray-600">Ingresos Aprobados</p>
                  <p className="text-2xl font-bold text-green-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
            <TabsTrigger value="watering">Riego</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>

          {/* Solicitudes */}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adoptionRequests.map((req) => (
                      <TableRow key={req._id}>
                        <TableCell>{req.userName} <br/><span className="text-sm text-gray-500">{req.userEmail}</span></TableCell>
                        <TableCell>{req.treeName} <br/><span className="text-sm italic">{req.treeSpecies}</span></TableCell>
                        <TableCell>{req.location}</TableCell>
                        <TableCell>{new Date(req.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell><Badge className={getStatusColor(req.status)}>{getStatusText(req.status)}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Riego */}
          <TabsContent value="watering">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" /> Solicitudes de Riego
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Árbol</TableHead>
                      <TableHead>Urgencia</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wateringRequests.map((req) => (
                      <TableRow key={req._id}>
                        <TableCell>{req.userName} <br/><span className="text-sm text-gray-500">{req.userEmail}</span></TableCell>
                        <TableCell>{req.treeName}</TableCell>
                        <TableCell><Badge>{req.urgency}</Badge></TableCell>
                        <TableCell><Badge className={getStatusColor(req.status)}>{getStatusText(req.status)}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pagos */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Pago</CardTitle>
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
                    {paymentRequests.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>{p.userName}</TableCell>
                        <TableCell>${p.amount}</TableCell>
                        <TableCell>{p.credits}</TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell>{new Date(p.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell><Badge className={getStatusColor(p.status)}>{getStatusText(p.status)}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuarios */}
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
                      <TableHead>Créditos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell>{u.nombre} <br/><span className="text-sm text-gray-500">{u.correo}</span></TableCell>
                        <TableCell><Badge className={getRoleColor(u.rol)}>{getRoleText(u.rol)}</Badge></TableCell>
                        <TableCell>{u.puntostotales}</TableCell>
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
