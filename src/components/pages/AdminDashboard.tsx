
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Users, DollarSign, CheckCircle, XCircle, TrendingUp, ImageIcon, Droplets, UserCheck, Upload, Check, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

/* ======================== Tipos ======================== */
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
  userName?: string;
  userEmail?: string;
  requesterName?: string;
  requesterId?: string;
  treeName?: string;
  treeId?: string;
  location?: string;
  urgency?: "low" | "medium" | "high";
  requestDate?: string;
  createdAt?: string;
  status: "pending" | "assigned" | "completed";
  completionStatus?: string;
  waterAmount?: string | number;
  duration?: string | number;
  treeCondition?: string;
  notes?: string;
  issues?: string;
  recommendations?: string;
  technicianId?: string;
  technicianName?: string;
  completedAt?: string;
  photoEvidence?: string;
  // Estado de pago local
  pago?: "pendiente" | "pagado";
  paymentStatus?: "pendiente" | "pagado";
}

interface PaymentRequest {
  _id: string;
  userName?: string;
  userEmail?: string;
  amount?: number;
  credits?: number;
  method?: string;
  requestDate?: string;
  status: "pending" | "approved" | "rejected";
  montoTotal?: number;
  paquete?: { creditos?: number };
  comprobanteUrl?: string;
  fechaCreacion?: string;
  estado?: string;
  metodoPago?: string;
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

/* ====== helpers de pago local (localStorage) ====== */
const PAGO_KEY = "riegoPago";
function readPagoMap(): Record<string, "pendiente" | "pagado"> {
  try {
    return JSON.parse(localStorage.getItem(PAGO_KEY) || "{}");
  } catch { return {}; }
}
function writePagoMap(map: Record<string, "pendiente" | "pagado">) {
  localStorage.setItem(PAGO_KEY, JSON.stringify(map));
}
function getPagoState(id: string): "pendiente" | "pagado" {
  const map = readPagoMap();
  return (map[id] as any) || "pendiente";
}
function setPagoState(id: string, value: "pendiente" | "pagado") {
  const map = readPagoMap();
  map[id] = value;
  writePagoMap(map);
}

/* ======================== Principal ======================== */
export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("watering");
  const [users, setUsers] = useState<User[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [wateringRequests, setWateringRequests] = useState<WateringRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedRiego, setSelectedRiego] = useState<WateringRequest | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [paying, setPaying] = useState<Record<string, boolean>>({});

  // Aprobación / Rechazo de pagos (módulo de paquetes)
  const handlePaymentAction = async (id: string, action: "approve" | "reject") => {
    try {
      const estado = action === "approve" ? "Aprobado" : "Rechazado";
      const res = await fetch(`http://localhost:4000/api/pago/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(action === "approve" ? "✅ Pago aprobado" : "❌ Pago rechazado");
        const resPayments = await fetch("http://localhost:4000/api/admin/payments");
        const dataPayments = await resPayments.json();
        setPaymentRequests(dataPayments);
      } else {
        toast.error(data.message || "Error al actualizar el pago");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión con el servidor");
    }
  };

  // Alternar pago de riegos (solo local)
  const toggleWateringPayment = (id: string, actual?: "pendiente" | "pagado") => {
    const next: "pendiente" | "pagado" = actual === "pagado" ? "pendiente" : "pagado";
    setPaying((p) => ({ ...p, [id]: true }));
    // guardar local
    setPagoState(id, next);
    // reflejar en memoria
    setWateringRequests((prev) =>
      prev.map((w) => (String(w._id) === String(id) ? { ...w, pago: next, paymentStatus: next } : w))
    );
    setTimeout(() => {
      setPaying((p) => {
        const { [id]: _, ...rest } = p;
        return rest;
      });
      toast.success(`Estado de pago actualizado a "${next}"`);
    }, 300);
  };

  // Notificador de nuevos pagos (paquetes)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admin/payments");
        const data = await res.json();
        if (Array.isArray(data) && data.length > paymentRequests.length) {
          toast.info("💸 Nuevo pago pendiente por revisar");
        }
        setPaymentRequests(data);
      } catch (e) { console.error("Error verificando pagos:", e); }
    }, 7000);
    return () => clearInterval(interval);
  }, [paymentRequests]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await fetch("http://localhost:4000/api/admin/users");
        setUsers(await resUsers.json());

        const resAdoptions = await fetch("http://localhost:4000/api/admin/adoption-requests");
        setAdoptionRequests(await resAdoptions.json());

        const resPayments = await fetch("http://localhost:4000/api/admin/payments");
        setPaymentRequests(await resPayments.json());

        const resWatering = await fetch("http://localhost:4000/api/tecnico/todos");
        const dataWatering: WateringRequest[] = await resWatering.json();
        // injerta pago local
        const withPago = dataWatering.map((w) => ({ ...w, pago: getPagoState(w._id) }));
        setWateringRequests(withPago);
      } catch (err) {
        console.error("❌ Error cargando datos del admin:", err);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalUsers: users.length,
    totalTechnicians: users.filter((u) => (u.rol || "").toLowerCase() === "técnico").length,
    totalRevenue: paymentRequests.reduce((acc, p) => acc + ((p.status || p.estado) === "approved" ? (p.amount || 0) : 0), 0),
    pendingRequests:
      adoptionRequests.filter((r) => (r.status || "").toLowerCase() === "pending").length +
      wateringRequests.filter((r) => (r.status || "").toLowerCase() === "pending").length +
      paymentRequests.filter((pr) => ((pr.estado || pr.status || "") as string).toLowerCase() === "pending").length,
  };

  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "assigned": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusText = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "pending": return "Pendiente";
      case "approved": return "Aprobado";
      case "rejected": return "Rechazado";
      case "assigned": return "Asignado";
      case "completed": return "Completado";
      default: return status || "—";
    }
  };
  const getRoleColor = (role: string) => {
    switch ((role || "").toLowerCase()) {
      case "administrador": return "bg-purple-100 text-purple-800";
      case "técnico": return "bg-blue-100 text-blue-800";
      case "cliente": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  const getRoleText = (role: string) => {
    switch ((role || "").toLowerCase()) {
      case "administrador": return "Administrador";
      case "técnico": return "Técnico";
      case "cliente": return "Usuario";
      default: return role || "—";
    }
  };

  const openReport = async (riego: WateringRequest) => {
    setSelectedRiego(riego);
    setReportOpen(true);
    if (riego.status === "completed" && (!riego.completedAt || !riego.completionStatus)) {
      try {
        setLoadingReport(true);
        const res = await fetch("http://localhost:4000/api/tecnico/todos");
        const list: WateringRequest[] = await res.json();
        const full = list.find((x) => String(x._id) === String(riego._id));
        if (full) setSelectedRiego(full);
      } catch (e) { console.error("Error cargando detalle del riego:", e); }
      finally { setLoadingReport(false); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona usuarios, adopciones, riegos, pagos y QR de cobro</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Técnicos Activos" value={stats.totalTechnicians} icon={<UserCheck className="h-8 w-8 text-blue-600" />} />
          <StatCard title="Usuarios Totales" value={stats.totalUsers} icon={<Users className="h-8 w-8 text-green-600" />} subtitle="Sistema activo" subtitleColor="text-green-600" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full justify-between bg-green-50 rounded-xl shadow-sm overflow-hidden">
            <TabsTrigger value="watering" className="flex-1 text-center py-3 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">💧 Riego</TabsTrigger>
            <TabsTrigger value="payments" className="flex-1 text-center py-3 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">💰 Pagos</TabsTrigger>
            <TabsTrigger value="users" className="flex-1 text-center py-3 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">👥 Usuarios</TabsTrigger>
            <TabsTrigger value="qr" className="flex-1 text-center py-3 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">📷 QR de Pago</TabsTrigger>
          </TabsList>

          <TabsContent value="watering">
            <WateringTable
              wateringRequests={wateringRequests}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              onViewReport={openReport}
              onTogglePayment={toggleWateringPayment}
              paying={paying}
            />

            <Dialog open={reportOpen} onOpenChange={setReportOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-green-900">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    {selectedRiego?.treeName || "Detalle de riego"}
                  </DialogTitle>
                </DialogHeader>
                {loadingReport ? (
                  <p className="text-gray-500">Cargando reporte...</p>
                ) : selectedRiego ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        {selectedRiego.photoEvidence ? (
                          <img src={`http://localhost:4000/uploads/riegos/${selectedRiego.photoEvidence}`} alt="Evidencia" className="w-full h-full object-cover" />
                        ) : (
                          <img src="https://placehold.co/800x450?text=Sin+evidencia" alt="Sin evidencia" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Solicitante:</strong> {selectedRiego.requesterName || "—"}</p>
                        <p><strong>Técnico:</strong> {selectedRiego.technicianName || "—"}</p>
                        <p><strong>Estado:</strong> <Badge className={getStatusColor(selectedRiego.status)}>{getStatusText(selectedRiego.status)}</Badge></p>
                        <p><strong>Creado:</strong> {selectedRiego.requestDate ? new Date(selectedRiego.requestDate).toLocaleString() : selectedRiego.createdAt ? new Date(selectedRiego.createdAt).toLocaleString() : "—"}</p>
                        <p><strong>Completado:</strong> {selectedRiego.completedAt ? new Date(selectedRiego.completedAt).toLocaleString() : "—"}</p>
                        <p><strong>Pago:</strong> <Badge className={(selectedRiego.pago || selectedRiego.paymentStatus) === "pagado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{selectedRiego.pago || selectedRiego.paymentStatus || "pendiente"}</Badge></p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-900">Reporte del técnico</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 p-3 rounded border"><p className="text-gray-500">Estado de finalización</p><p className="font-medium">{selectedRiego.completionStatus || "—"}</p></div>
                        <div className="bg-gray-50 p-3 rounded border"><p className="text-gray-500">Agua utilizada</p><p className="font-medium">{selectedRiego.waterAmount ? `${selectedRiego.waterAmount}` : "—"}</p></div>
                        <div className="bg-gray-50 p-3 rounded border"><p className="text-gray-500">Duración</p><p className="font-medium">{selectedRiego.duration ? `${selectedRiego.duration}` : "—"}</p></div>
                        <div className="bg-gray-50 p-3 rounded border"><p className="text-gray-500">Condición del árbol</p><p className="font-medium">{selectedRiego.treeCondition || "—"}</p></div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded border text-sm"><p className="text-gray-500 mb-1">Notas</p><p className="whitespace-pre-wrap">{selectedRiego.notes || "—"}</p></div>
                      <div className="bg-gray-50 p-3 rounded border text-sm"><p className="text-gray-500 mb-1">Problemas detectados</p><p className="whitespace-pre-wrap">{selectedRiego.issues || "—"}</p></div>
                      <div className="bg-gray-50 p-3 rounded border text-sm"><p className="text-gray-500 mb-1">Recomendaciones</p><p className="whitespace-pre-wrap">{selectedRiego.recommendations || "—"}</p></div>
                    </div>
                  </div>
                ) : (<p className="text-gray-500">Selecciona un riego para ver el detalle.</p>)}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTable
              paymentRequests={paymentRequests}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              handlePaymentAction={handlePaymentAction}
            />
          </TabsContent>

          <TabsContent value="users">
            <UsersTable users={users} getRoleColor={getRoleColor} getRoleText={getRoleText} />
          </TabsContent>

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

/* ======================== Subcomponentes ======================== */
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

function WateringTable({ wateringRequests, getStatusColor, getStatusText, onViewReport, onTogglePayment, paying }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Droplets className="h-5 w-5 text-blue-600" /> Solicitudes de Riego
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
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Reporte</TableHead>
              <TableHead>Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!wateringRequests || wateringRequests.length === 0) ? (
              <TableRow><TableCell colSpan={8} className="text-center text-gray-500 py-4">No hay solicitudes de riego registradas.</TableCell></TableRow>
            ) : (
              wateringRequests.map((req: WateringRequest) => {
                const pagoActual = (req.pago || req.paymentStatus || "pendiente") as "pendiente" | "pagado";
                const isPaying = Boolean(paying?.[req._id]);
                return (
                  <TableRow key={req._id}>
                    <TableCell>
                      {req.userName || req.requesterName || "—"}<br />
                      <span className="text-sm text-gray-500">{req.userEmail || "—"}</span>
                    </TableCell>
                    <TableCell>{req.treeName || "—"}</TableCell>
                    <TableCell>{req.location || "Sin ubicación"}</TableCell>
                    <TableCell>
                      <Badge className={req.urgency === "high" ? "bg-red-100 text-red-800" : req.urgency === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                        {req.urgency || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {req.requestDate ? new Date(req.requestDate).toLocaleDateString("es-BO",{day:"2-digit",month:"long",year:"numeric"}) :
                       req.createdAt ? new Date(req.createdAt).toLocaleDateString("es-BO",{day:"2-digit",month:"long",year:"numeric"}) : "—"}
                    </TableCell>
                    <TableCell><Badge className={getStatusColor(req.status)}>{getStatusText(req.status)}</Badge></TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => onViewReport(req)}>
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={isPaying}
                        className={pagoActual === "pagado" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-white"}
                        onClick={() => onTogglePayment(req._id, pagoActual)}
                      >
                        {isPaying ? "Actualizando..." : pagoActual === "pagado" ? "Pagado" : "Pendiente"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PaymentsTable({ paymentRequests, getStatusColor, getStatusText, handlePaymentAction }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <DollarSign className="h-5 w-5 text-green-700" /> Solicitudes de Pago
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
            {paymentRequests.map((p: any) => {
              const estadoPago = (p.estado || p.status || "").toLowerCase();
              return (
                <TableRow key={p._id}>
                  <TableCell>{p.nombreUsuario || p.userName || "—"}<br /><span className="text-sm text-gray-500">{p.userEmail || "—"}</span></TableCell>
                  <TableCell>Bs {p.montoTotal ?? p.amount ?? 0}</TableCell>
                  <TableCell>{p.paquete?.creditos ?? p.credits ?? 0}</TableCell>
                  <TableCell>{p.metodoPago || p.method || "—"}</TableCell>
                  <TableCell>{p.fechaCreacion || p.requestDate ? new Date(p.fechaCreacion || p.requestDate).toLocaleDateString() : "—"}</TableCell>
                  <TableCell>{p.comprobanteUrl ? (<a href={`http://localhost:4000${p.comprobanteUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Ver</a>) : "—"}</TableCell>
                  <TableCell><Badge className={getStatusColor(estadoPago)}>{getStatusText(estadoPago)}</Badge></TableCell>
                  <TableCell>
                    {estadoPago === "pendiente" || estadoPago === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handlePaymentAction(p._id, "approve")}><CheckCircle className="h-4 w-4 mr-1" /> Aprobar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handlePaymentAction(p._id, "reject")}><XCircle className="h-4 w-4 mr-1" /> Rechazar</Button>
                      </div>
                    ) : (<span className="text-gray-400">—</span>)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function UsersTable({ users, getRoleColor, getRoleText }: any) {
  return (
    <Card>
      <CardHeader><CardTitle>Gestión de Usuarios</CardTitle></CardHeader>
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
                <TableCell>{u.nombre}<br /><span className="text-sm text-gray-500">{u.correo}</span></TableCell>
                <TableCell><Badge className={getRoleColor(u.rol)}>{getRoleText(u.rol)}</Badge></TableCell>
                <TableCell>{u.puntostotales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function QRUploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentQR, setCurrentQR] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/qr")
      .then((res) => res.json())
      .then((data) => { if (data.success) setCurrentQR(`http://localhost:4000${data.imageUrl}`); });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("qrImage", selectedFile);
    const res = await fetch("http://localhost:4000/api/qr", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      setShowSuccess(true);
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
          <img src={currentQR} alt="QR actual" className="w-64 mx-auto rounded-lg shadow-md" />
        </div>
      )}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!preview ? (
          <>
            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Seleccionar imagen del nuevo QR</p>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-3" />
          </>
        ) : (<img src={preview} alt="preview" className="w-64 mx-auto rounded-lg shadow-md" />)}
      </div>
      <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleUpload} disabled={!selectedFile}>
        <Check className="h-4 w-4 mr-2" /> Subir QR
      </Button>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-green-800">
              <Check className="h-5 w-5" /> ¡QR Actualizado!
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">El nuevo código QR fue subido correctamente y ya está disponible para los usuarios al pagar.</p>
          <img src={currentQR ?? ""} alt="QR actualizado" className="w-48 mx-auto rounded-lg shadow-md" />
          <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowSuccess(false)}>Cerrar</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
