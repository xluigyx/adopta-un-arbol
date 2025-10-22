import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  TrendingUp,
  ImageIcon,
  Droplets,
  UserCheck,
  Upload,
  Check,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSettings } from "../../hooks/useSettings";

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

/* ====== helpers de pago local ====== */
const PAGO_KEY = "riegoPago";
function readPagoMap(): Record<string, "pendiente" | "pagado"> {
  try {
    return JSON.parse(localStorage.getItem(PAGO_KEY) || "{}");
  } catch {
    return {};
  }
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
  const [wateringRequests, setWateringRequests] = useState<WateringRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedRiego, setSelectedRiego] = useState<WateringRequest | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [paying, setPaying] = useState<Record<string, boolean>>({});

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await fetch("http://localhost:4000/api/admin/users");
        setUsers(await resUsers.json());

        const resPayments = await fetch("http://localhost:4000/api/admin/payments");
        setPaymentRequests(await resPayments.json());

        const resWatering = await fetch("http://localhost:4000/api/tecnico/todos");
        const dataWatering: WateringRequest[] = await resWatering.json();
        const withPago = dataWatering.map((w) => ({ ...w, pago: getPagoState(w._id) }));
        setWateringRequests(withPago);
      } catch (err) {
        console.error("❌ Error cargando datos del admin:", err);
      }
    };
    fetchData();
  }, []);

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
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch ((role || "").toLowerCase()) {
      case "administrador": return "Administrador";
      case "técnico": return "Técnico";
      default: return role || "Usuario";
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
      } catch (e) {
        console.error("Error cargando detalle del riego:", e);
      } finally {
        setLoadingReport(false);
      }
    }
  };

  const toggleWateringPayment = (id: string, actual?: "pendiente" | "pagado") => {
    const next = actual === "pagado" ? "pendiente" : "pagado";
    setPaying((p) => ({ ...p, [id]: true }));
    setPagoState(id, next);
    setWateringRequests((prev) =>
      prev.map((w) => (w._id === id ? { ...w, pago: next } : w))
    );
    setTimeout(() => {
      setPaying((p) => {
        const { [id]: _, ...rest } = p;
        return rest;
      });
      toast.success(`Estado de pago actualizado a "${next}"`);
    }, 300);
  };

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
        toast.success(`Pago ${estado.toLowerCase()}`);
      } else {
        toast.error(data.message || "Error al actualizar el pago");
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-6">
          Panel de Administración
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full justify-between bg-green-50 rounded-xl shadow-sm overflow-hidden">
            <TabsTrigger value="watering">💧 Riego</TabsTrigger>
            <TabsTrigger value="payments">💰 Pagos</TabsTrigger>
            <TabsTrigger value="users">👥 Usuarios</TabsTrigger>
            <TabsTrigger value="qr">📷 QR</TabsTrigger>
            <TabsTrigger value="prices">💵 Precios</TabsTrigger>
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
            <UsersTable
              users={users}
              getRoleColor={getRoleColor}
              getRoleText={getRoleText}
            />
          </TabsContent>

          <TabsContent value="qr">
            <QRUploadSection />
          </TabsContent>

          <TabsContent value="prices">
            <PricesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ======================== Subcomponentes ======================== */
function WateringTable({ wateringRequests, getStatusColor, getStatusText, onViewReport, onTogglePayment, paying }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de Riego</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Árbol</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wateringRequests.map((r: any) => (
              <TableRow key={r._id}>
                <TableCell>{r.userName || r.requesterName}</TableCell>
                <TableCell>{r.treeName}</TableCell>
                <TableCell>{r.location}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(r.status)}>
                    {getStatusText(r.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    disabled={paying[r._id]}
                    className={
                      r.pago === "pagado"
                        ? "bg-green-600 text-white"
                        : "bg-yellow-500 text-white"
                    }
                    onClick={() => onTogglePayment(r._id, r.pago)}
                  >
                    {r.pago === "pagado" ? "Pagado" : "Pendiente"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
          <DollarSign className="h-5 w-5 text-green-700" /> Pagos de Créditos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Paquete</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Créditos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                  No hay solicitudes de pago registradas.
                </TableCell>
              </TableRow>
            ) : (
              paymentRequests.map((p: any) => {
                const nombreUsuario =
                  p.userName ||
                  p.nombreUsuario ||
                  p.usuario?.nombre ||
                  p.user?.nombre ||
                  "—";

                const correoUsuario =
                  p.userEmail ||
                  p.usuario?.correo ||
                  p.user?.correo ||
                  "";

                const monto =
                  p.montoTotal ||
                  p.amount ||
                  p.total ||
                  0;

                const paqueteNombre =
                  p.paquete?.nombre ||
                  p.packageName ||
                  "—";

                const creditos =
                  p.paquete?.creditos ||
                  p.credits ||
                  0;

                const estado =
                  (p.estado || p.status || "pending").toLowerCase();

                return (
                  <TableRow key={p._id}>
                    <TableCell>
                      {nombreUsuario}
                      {correoUsuario && (
                        <div className="text-sm text-gray-500">{correoUsuario}</div>
                      )}
                    </TableCell>
                    <TableCell>{paqueteNombre}</TableCell>
                    <TableCell>Bs {monto}</TableCell>
                    <TableCell>{creditos}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(estado)}>
                        {getStatusText(estado)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {estado === "pending" || estado === "pendiente" ? (
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
                );
              })
            )}
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
        <CardTitle>Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Créditos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u._id}>
                <TableCell>{u.nombre}</TableCell>
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

function QRUploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("qrImage", file);
    const res = await fetch("http://localhost:4000/api/qr", { method: "POST", body: form });
    const data = await res.json();
    if (data.success) toast.success("QR actualizado");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir QR</CardTitle>
      </CardHeader>
      <CardContent>
        <input type="file" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
          }
        }} />
        {preview && <img src={preview} className="w-48 mt-3" />}
        <Button className="mt-4 bg-green-600 text-white" onClick={handleUpload}>
          Subir
        </Button>
      </CardContent>
    </Card>
  );
}

function PricesTab() {
  const { settings, setSettings } = useSettings();
  const [local, setLocal] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => setLocal(settings), [settings]);

  const updateCost = (key: "adoptCost" | "wateringCost", v: number) =>
    setLocal((p) => ({ ...p, costs: { ...p.costs, [key]: v } }));

  const updatePackage = (id: string, patch: any) =>
    setLocal((prev) => ({
      ...prev,
      packages: prev.packages.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }));

  const addPackage = () =>
    setLocal((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          id: `custom-${Date.now()}`,
          name: "Nuevo Paquete",
          credits: 10,
          price: 10,
          bonus: 0,
          description: "Paquete personalizado",
        },
      ],
    }));

  const removePackage = (id: string) =>
    setLocal((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== id),
    }));

  const onSave = async () => {
    setSaving(true);
    try {
      const body = {
        adoptionPrice: local.costs.adoptCost,
        waterPrice: local.costs.wateringCost,
        creditPackages: local.packages,
      };
      const res = await fetch("http://localhost:4000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("💾 Configuración guardada correctamente");
        setSettings(local); // sincroniza hook
      } else {
        toast.error("❌ Error al guardar configuración");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión con el servidor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-900">
          Configuración de Precios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* === Costos básicos === */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Costo de Adoptar (créditos)</Label>
            <Input
              type="number"
              value={local.costs.adoptCost}
              onChange={(e) => updateCost("adoptCost", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Costo de Riego (créditos)</Label>
            <Input
              type="number"
              value={local.costs.wateringCost}
              onChange={(e) =>
                updateCost("wateringCost", Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* === Paquetes === */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-green-900">
              Paquetes de Créditos
            </h4>
            <Button
              onClick={addPackage}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Añadir Paquete
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {local.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="border rounded-lg p-4 space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <Label className="font-medium">{pkg.name}</Label>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePackage(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={pkg.name}
                      onChange={(e) =>
                        updatePackage(pkg.id, { name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>ID</Label>
                    <Input
                      value={pkg.id}
                      onChange={(e) =>
                        updatePackage(pkg.id, { id: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Créditos</Label>
                    <Input
                      type="number"
                      value={pkg.credits}
                      onChange={(e) =>
                        updatePackage(pkg.id, {
                          credits: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Precio (Bs)</Label>
                    <Input
                      type="number"
                      value={pkg.price}
                      onChange={(e) =>
                        updatePackage(pkg.id, {
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Bonus</Label>
                    <Input
                      type="number"
                      value={pkg.bonus ?? 0}
                      onChange={(e) =>
                        updatePackage(pkg.id, {
                          bonus: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Descripción</Label>
                    <Input
                      value={pkg.description || ""}
                      onChange={(e) =>
                        updatePackage(pkg.id, {
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

