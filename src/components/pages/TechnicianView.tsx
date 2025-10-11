import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Droplets,
  MapPin,
  Clock,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

interface TechnicianViewProps {
  onNavigate: (view: string) => void;
  user: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "technician" | "user";
    joinDate: string;
    credits: number;
  };
}

interface Riego {
  _id: string;
  treeId: string;
  treeName: string;
  treeImage?: string;
  location?: string;
  latitud?: number;
  longitud?: number;
  requesterName?: string;
  status: "assigned" | "in-progress" | "completed";
  requestDate?: string;
  completionStatus?: string;
  photoEvidence?: string;
}

export function TechnicianView({ onNavigate, user }: TechnicianViewProps) {
  const [tasks, setTasks] = useState<Riego[]>([]);
  const [selectedTask, setSelectedTask] = useState<Riego | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [waterAmount, setWaterAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Cargar solicitudes pendientes
 useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/tecnico/pendientes");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("❌ Error al cargar solicitudes:", error);
    }
  };

  // 🔹 Primera carga inmediata
  fetchTasks();

  // 🔁 Refrescar cada 10 segundos
  const interval = setInterval(fetchTasks, 10000);

  // 🧹 Limpiar al desmontar
  return () => clearInterval(interval);
}, []);


  // 🔹 Iniciar riego
  const handleStartTask = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/tecnico/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "in-progress",
          technicianId: user._id,
          technicianName: user.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🚿 Riego iniciado");
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: "in-progress" } : t))
        );
      } else {
        toast.error(data.msg || "Error al iniciar riego");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar estado del riego");
    }
  };

  // 🔹 Enviar reporte final del riego
  const handleSubmitReport = async () => {
    if (!selectedTask || !photo) {
      toast.warning("Debes subir una foto de evidencia antes de enviar");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("photoEvidence", photo);
      formData.append("completionStatus", "Completado");
      formData.append("waterAmount", waterAmount);
      formData.append("duration", duration);
      formData.append("treeCondition", "Saludable");
      formData.append("notes", notes);
      formData.append("technicianId", user._id);
      formData.append("technicianName", user.name);

      const res = await fetch(
        `http://localhost:4000/api/tecnico/${selectedTask._id}/reportar`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Reporte enviado con éxito");
        setTasks((prev) =>
          prev.map((t) =>
            t._id === selectedTask._id ? { ...t, status: "completed" } : t
          )
        );
        setSelectedTask(null);
      } else {
        toast.error(data.msg || "Error al enviar reporte");
      }
    } catch (error) {
      console.error("❌ Error al enviar reporte:", error);
      toast.error("Error de conexión al enviar reporte");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <Droplets className="h-7 w-7 text-green-600" />
            Panel del Técnico
          </h1>
          <p className="text-gray-600 mt-1">
            Administra y completa las solicitudes de riego asignadas 💧
          </p>
        </div>

        {/* Lista de tareas */}
        {tasks.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No hay solicitudes pendientes por el momento 🌿
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className={`border-2 ${
                  task.status === "completed"
                    ? "border-green-400"
                    : task.status === "in-progress"
                    ? "border-blue-400"
                    : "border-gray-200"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {task.treeName}
                    <Badge
                      variant={
                        task.status === "completed"
                          ? "secondary"
                          : task.status === "in-progress"
                          ? "outline"
                          : "default"
                      }
                    >
                      {task.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <img
                    src={`http://localhost:4000/uploads/${task.treeImage}`}
                    alt={task.treeName}
                    className="w-full h-48 object-cover rounded-lg shadow"
                  />
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <MapPin className="inline h-4 w-4 mr-1 text-green-600" />
                      <strong>Ubicación:</strong>{" "}
                      {task.location || "No especificada"}
                    </p>
                    {task.latitud && (
                      <p>
                        📍 <strong>Coords:</strong> {task.latitud},{" "}
                        {task.longitud}
                      </p>
                    )}
                    <p>
                      <ClipboardList className="inline h-4 w-4 mr-1 text-green-600" />
                      <strong>Solicitado por:</strong> {task.requesterName || "N/A"}
                    </p>
                    <p>
                      <Clock className="inline h-4 w-4 mr-1 text-green-600" />
                      {new Date(task.requestDate || "").toLocaleString()}
                    </p>
                  </div>

                  {task.status === "assigned" && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleStartTask(task._id)}
                    >
                      <Droplets className="mr-2 h-4 w-4" /> Iniciar riego
                    </Button>
                  )}

                  {task.status === "in-progress" && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setSelectedTask(task)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Finalizar y reportar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de reporte */}
        {selectedTask && (
          <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-green-600" />
                  Reportar Riego — {selectedTask.treeName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    💧 Cantidad de agua usada
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 mt-1"
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(e.target.value)}
                    placeholder="Ej: 20 litros"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ⏱ Duración del riego
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 mt-1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ej: 10 minutos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    📝 Notas / Observaciones
                  </label>
                  <textarea
                    className="w-full border rounded-md p-2 mt-1"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Observaciones del riego..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    📸 Evidencia fotográfica
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  {photo && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-green-600" />
                      {photo.name}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSubmitReport}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar reporte"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
