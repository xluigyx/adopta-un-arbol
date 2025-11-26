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

  const handlePaymentAction = async (id: string, action: string) => {
  const estado = action === "Aprobado" ? "Aprobado" : "Rechazado";
  const fetchPayments = async () => {
  const res = await fetch("http://localhost:4000/api/admin/payments");
  const list = await res.json();
  setPaymentRequests(list);
};


  try {
    const res = await fetch(`http://localhost:4000/api/pago/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Error al actualizar pago");
    }

    toast.success(`Pago ${estado === "Aprobado" ? "aprobado" : "rechazado"}`);

    // refrescar lista de pagos
    fetchPayments();
  } catch (err) {
    console.error(err);
    toast.error("Error al actualizar pago");
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
        {reportOpen && selectedRiego && (
  <Dialog open={reportOpen} onOpenChange={setReportOpen}>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Reporte del Técnico</DialogTitle>
      </DialogHeader>

      {loadingReport ? (
        <p className="text-center py-4">Cargando reporte...</p>
      ) : (
        <div className="space-y-3 text-sm">
          <p><b>Árbol:</b> {selectedRiego.treeName}</p>
          <p><b>Usuario:</b> {selectedRiego.userName || selectedRiego.requesterName}</p>
          <p><b>Técnico:</b> {selectedRiego.technicianName || "No registrado"}</p>

          <p><b>Estado de Compleción:</b></p>
          <p className="bg-gray-100 p-2 rounded">
            {selectedRiego.completionStatus || "—"}
          </p>

          <p><b>Notas:</b></p>
          <p className="bg-gray-100 p-2 rounded">
            {selectedRiego.notes || "—"}
          </p>

          <p><b>Recomendaciones:</b></p>
          <p className="bg-gray-100 p-2 rounded">
            {selectedRiego.recommendations || "—"}
          </p>

          {selectedRiego.photoEvidence && (
            <>
              <p><b>Evidencia Fotográfica:</b></p>
              {console.log("📸 PHOTO RAW:", selectedRiego.photoEvidence)}

              <img
  src={`http://localhost:4000/uploads/riegos/${selectedRiego.photoEvidence}`}
  className="w-full rounded border"
/>



            </>
          )}
        </div>
      )}
    </DialogContent>
  </Dialog>
)}
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
                <TableHead>Reporte Técnico</TableHead>  {/* NUEVO */}
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

{/* ---------------- NUEVA COLUMNA ---------------- */}
<TableCell>
  {r.status === "completed" && (r.completionStatus || r.notes || r.photoEvidence) ? (
    <Button
      size="sm"
      className="bg-blue-600 text-white"
      onClick={() => onViewReport(r)}
    >
      Ver Reporte
    </Button>
  ) : (
    <Badge className="bg-gray-200 text-gray-700">Sin reporte</Badge>
  )}
</TableCell>
{/* ------------------------------------------------ */}


<TableCell>
  <Button
  size="sm"
  disabled={r.pago === "pagado" || paying[r._id]} 
  className={
    r.pago === "pagado"
      ? "bg-green-600 text-white cursor-not-allowed opacity-70"
      : "bg-yellow-500 text-white"
  }
  onClick={() => {
    if (r.pago !== "pagado") onTogglePayment(r._id, r.pago);
  }}
>
  {r.pago === "pagado" ? "Pagado" : "Pagar"}
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
  const [imgPreviewOpen, setImgPreviewOpen] = useState(false);
  const [imgPreviewSrc, setImgPreviewSrc] = useState<string | null>(null);

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
              <TableHead>Comprobante</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paymentRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-4">
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

                const comprobante = p.comprobanteUrl || p.comprobante || p.file;
                const url = comprobante
                  ? `http://localhost:4000/${comprobante.replace(/^\/+/, "")}`
                  : null;

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
                      {url ? (
                        comprobante.endsWith(".pdf") ? (
                          <a
                            href={url}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            Ver PDF
                          </a>
                        ) : (
                          <img
                            src={url}
                            className="h-16 w-auto rounded border cursor-pointer object-cover"
                            onClick={() => {
                              setImgPreviewSrc(url);
                              setImgPreviewOpen(true);
                            }}
                          />
                        )
                      ) : (
                        <span className="text-gray-400">No subido</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {estado === "pending" || estado === "pendiente" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handlePaymentAction(p._id, "Aprobado")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Aprobar
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handlePaymentAction(p._id, "Rechazado")}
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

      {/* MODAL DE PREVISUALIZACIÓN */}
      <Dialog open={imgPreviewOpen} onOpenChange={setImgPreviewOpen}>
        <DialogContent className="max-w-3xl p-2">
          {imgPreviewSrc && (
            <img
              src={imgPreviewSrc}
              className="w-full rounded shadow-lg"
            />
          )}
        </DialogContent>
      </Dialog>
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
    if (!file) {
      alert("Selecciona un archivo primero");
      return;
    }

    const form = new FormData();
    form.append("qrImage", file);

    try {
      const res = await fetch("http://localhost:4000/api/qr", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        alert("QR actualizado correctamente");
      } else {
        alert("Error al subir QR");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir QR</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setPreview(URL.createObjectURL(f));
            }
          }}
        />

        {preview && <img src={preview} className="w-48 mt-3" />}

        <Button
          className="mt-4 bg-green-600 text-white"
          onClick={handleUpload}
        >
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => setLocal(settings), [settings]);

  /* ===========================
        VALIDACIONES
  ==============================*/

  // ✔ Permite borrar libremente
  const validateName = (name: string) => {
    const trimmed = name.trim();

    // Validar solo si hay texto
    if (trimmed.length > 0) {
      if (trimmed.length < 2 || trimmed.length > 30)
        return "El nombre debe tener entre 2 y 30 caracteres.";

      if (!/^[a-zA-Z0-9 ]+$/.test(trimmed))
        return "El nombre solo puede contener letras y números.";
    }

    return null;
  };

  const validateDesc = (d: string) => {
    const t = d.trim();
    if (t.length < 5 || t.length > 120)
      return "La descripción debe tener entre 5 y 120 caracteres.";
    return null;
  };

  const validateNumber = (n: number, min = 1, max = 9999, name = "valor") => {
    if (isNaN(n) || n < min || n > max)
      return `${name} debe estar entre ${min} y ${max}.`;
    return null;
  };

  /* ===========================
         COSTOS BASE
  ===========================*/
  const updateCost = (key: "adoptCost" | "wateringCost", value: number) => {
    const err = validateNumber(value, 1, 9999, "El costo");
    if (err) return toast.error(err);
    setLocal((p) => ({ ...p, costs: { ...p.costs, [key]: value } }));
  };

  /* ===========================
          ACTUALIZAR PAQUETE
  ============================*/

  const updatePackage = (id: string, patch: any) =>
    setLocal((prev) => {
      const updated = prev.packages.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      );

      return { ...prev, packages: updated };
    });

  /* ===========================
          CRUD DE PAQUETES
  ============================*/

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

  /* ===========================
           GUARDAR CAMBIOS
  ============================*/
  const saveChanges = async () => {
    setSaving(true);

    // 🔥 VALIDAR TODOS LOS PAQUETES ANTES DE GUARDAR
    for (const pkg of local.packages) {
      const e1 = validateName(pkg.name);
      if (e1) {
        toast.error(`Error en "${pkg.name}": ${e1}`);
        setSaving(false);
        setConfirmOpen(false);
        return;
      }

     const e3 = validateNumber(Number(pkg.credits), 1, 9999, "Créditos");
      if (e3) {
        toast.error(`Error en paquete "${pkg.name}": ${e3}`);
        setSaving(false);
        return;
      }

      const e4 = validateNumber(Number(pkg.price), 1, 9999, "Precio");
      if (e4) {
        toast.error(`Error en paquete "${pkg.name}": ${e4}`);
        setSaving(false);
        return;
      }

      const e5 = validateNumber(Number(pkg.bonus), 0, 9999, "Bonus");
      if (e5) {
        toast.error(`Error en paquete "${pkg.name}": ${e5}`);
        setSaving(false);
        return;
      }

      const e6 = validateDesc(pkg.description ?? "");

      if (e6) {
        toast.error(`Error en paquete "${pkg.name}": ${e6}`);
        setSaving(false);
        return;
      }
    }

    // Evitar duplicados por nombre
    const names = local.packages.map((p) =>
      p.name.trim().toLowerCase()
    );
    const duplicates = names.filter(
      (n, i) => names.indexOf(n) !== i
    );

    if (duplicates.length > 0) {
      toast.error("No puedes tener paquetes con el mismo nombre.");
      setSaving(false);
      return;
    }

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
      if (!data.success) throw new Error();

      setSettings(local);
      toast.success("Cambios guardados correctamente ✔");
    } catch {
      toast.error("Error al guardar configuración");
    }

    setSaving(false);
    setConfirmOpen(false);
  };

  /* ===========================
             UI
  ============================*/
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-900">Configuración de Precios</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* COSTOS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Costo de Adoptar (créditos)</Label>
            <Input
              type="number"
              value={local.costs.adoptCost}
              onChange={(e) =>
                updateCost("adoptCost", Number(e.target.value))
              }
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

        {/* PAQUETES */}
<div>
  <div className="flex items-center justify-between mb-2">
    <h4 className="font-semibold text-green-900">Paquetes de Créditos</h4>
    <Button
      onClick={addPackage}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      + Añadir Paquete
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
            Eliminar
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">

          {/* === NOMBRE === */}
          <div>
            <Label>Nombre</Label>
            <Input
              value={pkg.name}
              onChange={(e) => updatePackage(pkg.id, { name: e.target.value })}
            />
          </div>

          {/* === ID (Bloqueado) === */}
          <div>
            <Label>ID</Label>
            <Input value={pkg.id} disabled />
          </div>

          {/* === CRÉDITOS — PERMITE BORRAR === */}
          <div>
            <Label>Créditos</Label>
            <Input
              type="number"
              value={pkg.credits === null ? "" : pkg.credits}
              onChange={(e) => {
                const v = e.target.value;

                // Permite borrar el input
                if (v === "") {
                  updatePackage(pkg.id, { credits: null });
                  return;
                }

                updatePackage(pkg.id, { credits: Number(v) });
              }}
            />
          </div>

          {/* === PRECIO — PERMITE BORRAR === */}
          <div>
            <Label>Precio (Bs)</Label>
            <Input
              type="number"
              value={pkg.price === null ? "" : pkg.price}
              onChange={(e) => {
                const v = e.target.value;

                if (v === "") {
                  updatePackage(pkg.id, { price: null });
                  return;
                }

                updatePackage(pkg.id, { price: Number(v) });
              }}
            />
          </div>

          {/* === BONUS — PERMITE BORRAR === */}
          <div>
            <Label>Bonus</Label>
            <Input
              type="number"
              value={pkg.bonus === null ? "" : pkg.bonus}
              onChange={(e) => {
                const v = e.target.value;

                if (v === "") {
                  updatePackage(pkg.id, { bonus: null });
                  return;
                }

                updatePackage(pkg.id, { bonus: Number(v) });
              }}
            />
          </div>

          {/* === DESCRIPCIÓN === */}
          <div className="col-span-2">
            <Label>Descripción</Label>
            <Input
              value={pkg.description || ""}
              onChange={(e) =>
                updatePackage(pkg.id, { description: e.target.value })
              }
            />
          </div>

        </div>
      </div>
    ))}
  </div>
</div>


        {/* BOTÓN GUARDAR */}
        <div className="flex gap-3">
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Guardar Cambios
          </Button>
        </div>

        {/* MODAL DE CONFIRMACIÓN */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle>¿Guardar cambios?</DialogTitle>
            </DialogHeader>
            <p>
              Estás a punto de modificar los precios y paquetes.
              ¿Deseas continuar?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-green-600 text-white"
                onClick={saveChanges}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Confirmar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}
