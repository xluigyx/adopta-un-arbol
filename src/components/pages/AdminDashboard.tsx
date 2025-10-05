import { useState, useEffect } from "react";
import { toast } from "sonner"; // 🟢 NUEVO
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Eye,
  Droplets,
  UserCheck,
  Upload,
  ImageIcon,
  Check,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";


interface AdoptionRequest {
  _id: string;
  userName: string;
  userEmail: string;
  treeName: string;
  treeSpecies: string;
  location: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  credits: number;
}

interface WateringRequest {
  _id: string;
  userName: string;
  userEmail: string;
  treeName: string;
  location: string;
  requestDate: string;
  status: "pending" | "assigned" | "completed";
  assignedTechnician?: string;
  urgency: "low" | "medium" | "high";
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
  status: "pending" | "approved" | "rejected";
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


  // 🔹 Cargar datos desde el backend
  export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState<User[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [wateringRequests, setWateringRequests] = useState<WateringRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);

  // 🟢 NUEVO: aprobar o rechazar pago
  const handlePaymentAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/payments/${id}/${action}`, {
        method: "PUT",
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          action === "approve"
            ? "✅ Pago aprobado correctamente"
            : "❌ Pago rechazado correctamente"
        );
        // refrescar lista
        setPaymentRequests(prev =>
          prev.map(p =>
            p._id === id
              ? { ...p, status: action === "approve" ? "approved" : "rejected" }
              : p
          )
        );
      } else {
        toast.error("Error al actualizar el pago");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión con el servidor");
    }
  };

  // 🟢 NUEVO: detectar nuevos pagos y notificar
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admin/payments");
        const data = await res.json();
        if (Array.isArray(data) && data.length > paymentRequests.length) {
          toast.info("💸 Nuevo pago pendiente por revisar");
        }
        setPaymentRequests(data);
      } catch (e) {
        console.error("Error verificando pagos:", e);
      }
    }, 7000); // cada 7 segundos

    return () => clearInterval(interval);
  }, [paymentRequests]);

  // 🔹 Cargar datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await fetch("http://localhost:4000/api/admin/users");
        const dataUsers = await resUsers.json();
        setUsers(dataUsers);

        const resAdoptions = await fetch("http://localhost:4000/api/admin/adoption-requests");
        const dataAdoptions = await resAdoptions.json();
        setAdoptionRequests(dataAdoptions);

        const resPayments = await fetch("http://localhost:4000/api/admin/payments");
        const dataPayments = await resPayments.json();
        setPaymentRequests(dataPayments);

        const resWatering = await fetch("http://localhost:4000/api/admin/watering-requests");
        const dataWatering = await resWatering.json();
        setWateringRequests(dataWatering);
      } catch (err) {
        console.error("❌ Error cargando datos del admin:", err);
      }
    };

    fetchData();
  }, []);


  // 📊 Stats rápidos
  const stats = {
    totalUsers: users.length,
    totalTechnicians: users.filter((u) => u.rol?.toLowerCase() === "técnico").length,
    totalRevenue: paymentRequests.reduce(
      (acc, p) => acc + (p.status === "approved" ? p.amount : 0),
      0
    ),
    pendingRequests:
      adoptionRequests.filter((r) => r.status === "pending").length +
      wateringRequests.filter((r) => r.status === "pending").length +
      paymentRequests.filter((r) => r.status === "pending").length,
  };

  // 🔹 Helpers UI
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "approved":
        return "Aprobado";
      case "rejected":
        return "Rechazado";
      case "assigned":
        return "Asignado";
      case "completed":
        return "Completado";
      default:
        return status;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "administrador":
        return "bg-purple-100 text-purple-800";
      case "técnico":
        return "bg-blue-100 text-blue-800";
      case "cliente":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch (role.toLowerCase()) {
      case "administrador":
        return "Administrador";
      case "técnico":
        return "Técnico";
      case "cliente":
        return "Usuario";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">
            Gestiona usuarios, adopciones, riegos, pagos y QR de cobro
          </p>
        </div>

        {/* 🔹 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Solicitudes Pendientes"
            value={stats.pendingRequests}
            icon={<Clock className="h-8 w-8 text-yellow-600" />}
            subtitle="Requieren atención"
            subtitleColor="text-yellow-600"
          />
          <StatCard
            title="Técnicos Activos"
            value={stats.totalTechnicians}
            icon={<UserCheck className="h-8 w-8 text-blue-600" />}
          />
          <StatCard
            title="Usuarios Totales"
            value={stats.totalUsers}
            icon={<Users className="h-8 w-8 text-green-600" />}
            subtitle="Sistema activo"
            subtitleColor="text-green-600"
          />
          <StatCard
            title="Ingresos Aprobados"
            value={`Bs ${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-8 w-8 text-green-600" />}
          />
        </div>

        {/* 🔹 Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
            <TabsTrigger value="watering">Riego</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="qr">QR de Pago</TabsTrigger>
          </TabsList>

          {/* 📦 Solicitudes */}
          <TabsContent value="requests">
            <RequestTable requests={adoptionRequests} getStatusColor={getStatusColor} getStatusText={getStatusText} />
          </TabsContent>

          {/* 💧 Riego */}
          <TabsContent value="watering">
            <WateringTable wateringRequests={wateringRequests} getStatusColor={getStatusColor} getStatusText={getStatusText} />
          </TabsContent>

          {/* 💰 Pagos */}
         <TabsContent value="payments">
  <PaymentsTable
    paymentRequests={paymentRequests}
    getStatusColor={getStatusColor}
    getStatusText={getStatusText}
    handlePaymentAction={handlePaymentAction} // ✅ este nuevo
  />
</TabsContent>


          {/* 👤 Usuarios */}
          <TabsContent value="users">
            <UsersTable users={users} getRoleColor={getRoleColor} getRoleText={getRoleText} />
          </TabsContent>

          {/* 🧾 QR de Pago */}
          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <ImageIcon className="h-5 w-5" /> Subir o Actualizar Código QR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <QRUploadSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ---------- Subcomponentes para mantener orden ---------- */

function StatCard({ title, value, icon, subtitle, subtitleColor }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-green-900">{value}</p>
          </div>
          {icon}
        </div>
        {subtitle && (
          <div className={`mt-2 flex items-center text-sm ${subtitleColor}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{subtitle}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RequestTable({ requests, getStatusColor, getStatusText }: any) {
  return (
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
            {requests.map((req: any) => (
              <TableRow key={req._id}>
                <TableCell>
                  {req.userName}
                  <br />
                  <span className="text-sm text-gray-500">{req.userEmail}</span>
                </TableCell>
                <TableCell>
                  {req.treeName}
                  <br />
                  <span className="text-sm italic">{req.treeSpecies}</span>
                </TableCell>
                <TableCell>{req.location}</TableCell>
                <TableCell>{new Date(req.requestDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(req.status)}>
                    {getStatusText(req.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function WateringTable({ wateringRequests, getStatusColor, getStatusText }: any) {
  return (
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
            {wateringRequests.map((req: any) => (
              <TableRow key={req._id}>
                <TableCell>
                  {req.userName}
                  <br />
                  <span className="text-sm text-gray-500">{req.userEmail}</span>
                </TableCell>
                <TableCell>{req.treeName}</TableCell>
                <TableCell>
                  <Badge>{req.urgency}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(req.status)}>
                    {getStatusText(req.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PaymentsTable({
  paymentRequests,
  getStatusColor,
  getStatusText,
  handlePaymentAction, // ✅ se recibe aquí como prop
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <DollarSign className="h-5 w-5 text-green-700" />
          Solicitudes de Pago
        </CardTitle>
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
              <TableHead>Comprobante</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paymentRequests.map((p: any) => (
              <TableRow key={p._id}>
                <TableCell>
                  {p.nombreUsuario || p.userName || "—"}
                  <br />
                  <span className="text-sm text-gray-500">
                    {p.userEmail || "—"}
                  </span>
                </TableCell>

                <TableCell>Bs {p.montoTotal || p.amount || 0}</TableCell>
                <TableCell>{p.paquete?.creditos || p.credits || 0}</TableCell>
                <TableCell>{p.metodoPago || p.method || "—"}</TableCell>

                <TableCell>
                  {p.fechaCreacion || p.requestDate
                    ? new Date(p.fechaCreacion || p.requestDate).toLocaleDateString()
                    : "—"}
                </TableCell>

                <TableCell>
                  {p.comprobanteUrl ? (
                    <a
                      href={`http://localhost:4000${p.comprobanteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Ver
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell>
                  <Badge className={getStatusColor(p.estado || p.status)}>
                    {getStatusText(p.estado || p.status)}
                  </Badge>
                </TableCell>

                <TableCell>
                  {(p.estado || p.status) === "pendiente" || (p.estado || p.status) === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handlePaymentAction(p._id, "approve")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Aprobar
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handlePaymentAction(p._id, "reject")}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Rechazar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}




function UsersTable({ users, getRoleColor, getRoleText }: any) {
  return (
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
            {users.map((u: any) => (
              <TableRow key={u._id}>
                <TableCell>
                  {u.nombre}
                  <br />
                  <span className="text-sm text-gray-500">{u.correo}</span>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(u.rol)}>
                    {getRoleText(u.rol)}
                  </Badge>
                </TableCell>
                <TableCell>{u.puntostotales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ---------- Sección QR ---------- */
function QRUploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentQR, setCurrentQR] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/qr")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCurrentQR(`http://localhost:4000${data.imageUrl}`);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("qrImage", selectedFile);

    const res = await fetch("http://localhost:4000/api/qr", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setShowSuccess(true); // 🟩 abrir modal
      setCurrentQR(`http://localhost:4000${data.imageUrl}`);
      setSelectedFile(null);
      setPreview(null);
    } else {
      alert("❌ Error al subir el QR");
    }
  };

  return (
    <div className="space-y-6">
      {currentQR && (
        <div className="text-center">
          <h4 className="font-medium mb-2">QR Actual:</h4>
          <img
            src={currentQR}
            alt="QR actual"
            className="w-64 mx-auto rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!preview ? (
          <>
            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Seleccionar imagen del nuevo QR</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-3"
            />
          </>
        ) : (
          <img
            src={preview}
            alt="preview"
            className="w-64 mx-auto rounded-lg shadow-md"
          />
        )}
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        <Check className="h-4 w-4 mr-2" /> Subir QR
      </Button>

      {/* 🟩 Modal de éxito */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-green-800">
              <Check className="h-5 w-5" /> ¡QR Actualizado!
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            El nuevo código QR fue subido correctamente y ya está disponible
            para los usuarios al pagar.
          </p>
          <img
            src={currentQR ?? ""}
            alt="QR actualizado"
            className="w-48 mx-auto rounded-lg shadow-md"
          />
          <Button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setShowSuccess(false)}
          >
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}


