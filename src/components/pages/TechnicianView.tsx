import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MapPin, Droplets, Eye, Loader2, Clock, User2 } from "lucide-react";
import { toast } from "sonner";
import { WateringReportForm } from "./WateringReportForm";

interface RiegoTask {
  _id: string;
  treeId: string;
  treeName: string;
  location: string;
  requesterName: string;
  urgency: "low" | "medium" | "high";
  requestDate: string;
  dueDate?: string;
  status: "assigned" | "in-progress" | "completed";
  treeImage?: string;
}

interface Technician {
  _id: string;
  name: string;
  email: string;
  role: "technician"|"admin"|"user";
  joinDate: string;
  credits: number;
}

interface TechnicianViewProps {
  user: Technician;
  onNavigate?: (view: string) => void;
}
export function TechnicianView({ user,onNavigate }: TechnicianViewProps) {
  const [tasks, setTasks] = useState<RiegoTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<RiegoTask | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar solicitudes de riego
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/tecnico/pendientes");
      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Error al obtener solicitudes");
      setTasks(data);
    } catch (error) {
      console.error("❌ Error al cargar tareas:", error);
      toast.error("No se pudieron cargar las solicitudes de riego");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // 🔁 Actualización automática cada 10 segundos
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🔧 Iniciar tarea (actualiza estado a in-progress)
  const handleStartTask = async (taskId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/tecnico/${taskId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "in-progress",
          technicianId: user._id,
          technicianName: user.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al actualizar estado");

      toast.success("🚿 Tarea de riego iniciada");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo iniciar la tarea");
    }
  };

  // 🔹 Cuando el técnico completa el reporte
  const handleTaskCompleted = () => {
    toast.success("✅ Riego completado con éxito");
    setSelectedTask(null);
    fetchTasks();
  };

  // 🔸 Colores de urgencia
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 🔸 Texto de urgencia
  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return urgency;
    }
  };

  // 🔸 Si selecciona una tarea, mostrar formulario
  if (selectedTask) {
    return (
      <WateringReportForm
        task={selectedTask}
        technician={user}
        onCancel={() => setSelectedTask(null)}
        onCompleted={handleTaskCompleted}
      />
    );
  }

  // 🔸 Vista principal del panel técnico
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-900 mb-2">
            Panel del Técnico 🌳
          </h1>
          <p className="text-gray-600">
            Gestiona las solicitudes de riego asignadas y reporta tu trabajo.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <User2 className="h-4 w-4 text-green-700" />
            <span className="text-green-800 font-medium">
              {user.name} — Técnico
            </span>
          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-green-700 h-8 w-8" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            <Droplets className="h-10 w-10 mx-auto text-green-500 mb-3" />
            <p>No hay solicitudes pendientes de riego en este momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className="hover:shadow-xl border border-green-100 rounded-xl transition-all"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-green-900">
                    <span className="truncate">{task.treeName}</span>
                    <Badge className={getUrgencyColor(task.urgency)}>
                      {getUrgencyText(task.urgency)}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {/* 🌿 Imagen del árbol */}
                  {task.treeImage ? (
                    <img
                      src={`http://localhost:4000/uploads/${task.treeImage}`}
                      alt={task.treeName}
                      className="rounded-lg shadow-md mb-3 h-44 w-full object-cover border border-green-100"
                    />
                  ) : (
                    <div className="h-44 flex items-center justify-center bg-gray-100 rounded-lg mb-3">
                      <Droplets className="h-10 w-10 text-gray-400" />
                    </div>
                  )}

                  {/* 📍 Ubicación */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>{task.location || "Ubicación no disponible"}</span>
                  </div>

                  {/* 👤 Solicitante */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <User2 className="h-4 w-4 text-green-600" />
                    <span>Solicitado por: </span>
                    <span className="font-medium text-green-800">
                      {task.requesterName}
                    </span>
                  </div>

                  {/* 🕓 Fecha */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>
                      {new Date(task.requestDate).toLocaleDateString("es-BO", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3">
                    {task.status === "assigned" && (
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                        onClick={() => handleStartTask(task._id)}
                      >
                        <Droplets className="mr-2 h-4 w-4" /> Iniciar Riego
                      </Button>
                    )}

                    {task.status === "in-progress" && (
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
                        onClick={() => setSelectedTask(task)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> Reportar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}