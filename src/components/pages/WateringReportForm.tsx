import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Droplets,
  Camera,
  MapPin,
  Calendar,
  Upload,
  CheckCircle,
  AlertTriangle,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";
import API_BASE_URL from "../../config/api";

interface WateringTask {
  _id: string;
  treeId: string;
  treeName: string;
  location: string;
  requesterName: string;
  urgency: "low" | "medium" | "high";
  requestDate: string;
  dueDate?: string;
  notes?: string;
  treeImage?: string;
}

interface Technician {
  _id: string;
  name: string;
}

interface WateringReport {
  completionStatus: "full" | "partial" | "unable";
  waterAmount: string;
  duration: string;
  treeCondition: "excellent" | "good" | "fair" | "poor";
  notes: string;
  issues: string;
  recommendations: string;
  photoEvidence: File | null;
}

interface WateringReportFormProps {
  task: WateringTask;
  technician: Technician;
  onCancel: () => void;
  onCompleted: () => void;
}

export function WateringReportForm({
  task,
  technician,
  onCancel,
  onCompleted,
}: WateringReportFormProps) {
  const [report, setReport] = useState<Partial<WateringReport>>({
    completionStatus: undefined,
    waterAmount: "",
    duration: "",
    treeCondition: undefined,
    notes: "",
    issues: "",
    recommendations: "",
    photoEvidence: null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReport((prev) => ({ ...prev, photoEvidence: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setReport((prev) => ({ ...prev, photoEvidence: null }));
    setPhotoPreview(null);
  };

  const isFormValid = () => {
    return (
      report.completionStatus &&
      report.treeCondition &&
      report.notes?.trim() &&
      report.photoEvidence
    );
  };

  // 🔥 Enviar reporte al backend
  const handleSubmit = async () => {
    if (!isFormValid() || !task._id) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("completionStatus", report.completionStatus!);
      formData.append("waterAmount", report.waterAmount || "");
      formData.append("duration", report.duration || "");
      formData.append("treeCondition", report.treeCondition!);
      formData.append("notes", report.notes || "");
      formData.append("issues", report.issues || "");
      formData.append("recommendations", report.recommendations || "");
      formData.append("technicianId", technician._id);
      formData.append("technicianName", technician.name);
      if (report.photoEvidence)
        formData.append("photoEvidence", report.photoEvidence);

      const res = await fetch(
        `${API_BASE_URL}/api/tecnico/${task._id}/reportar`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al guardar reporte");

      toast.success("✅ Reporte enviado con éxito");
      onCompleted();
      setShowSubmitDialog(false);
    } catch (error) {
      console.error("❌ Error al enviar reporte:", error);
      toast.error("Error al enviar el reporte");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-700 bg-red-100";
      case "medium":
        return "text-yellow-700 bg-yellow-100";
      case "low":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="outline" onClick={onCancel} className="mb-6">
          ← Volver
        </Button>

        <h1 className="text-3xl font-bold text-green-900 mb-6">
          Reporte de Riego 🌳
        </h1>

        {/* Información de la tarea */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Droplets className="h-5 w-5 text-blue-600" />
              Detalles de la Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={
                    task.treeImage
                      ? `${API_BASE_URL}/uploads/${task.treeImage}`
                      : "/no-image.png"
                  }
                  alt={task.treeName}
                  className="rounded-lg shadow w-full h-48 object-cover mb-3"
                />
                <h3 className="text-lg font-semibold text-green-900">
                  {task.treeName}
                </h3>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-green-500" />
                  {task.location}
                </p>
              </div>

              <div className="space-y-2">
                <Badge className={getUrgencyColor(task.urgency)}>
                  {getUrgencyText(task.urgency)}
                </Badge>
                <p className="text-sm text-gray-600">
                  Solicitado por:{" "}
                  <span className="font-medium">{task.requesterName}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Fecha:{" "}
                  <span className="font-medium">
                    {new Date(task.requestDate).toLocaleDateString()}
                  </span>
                </p>
                {task.notes && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg border text-sm text-gray-700">
                    <strong>Notas del solicitante:</strong> {task.notes}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <FileText className="h-5 w-5 text-green-600" />
              Reporte Técnico
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Estado de completado */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Estado del riego *
              </Label>
              <RadioGroup
                value={report.completionStatus}
                onValueChange={(value: string) =>
                  setReport((prev) => ({ ...prev, completionStatus: value as any }))
                }
              >
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                  <Label htmlFor="full" className="flex items-center gap-2">
                    <RadioGroupItem value="full" id="full" />
                    <CheckCircle className="h-4 w-4 text-green-600" /> Completado
                  </Label>

                  <Label htmlFor="partial" className="flex items-center gap-2">
                    <RadioGroupItem value="partial" id="partial" />
                    <AlertTriangle className="h-4 w-4 text-yellow-600" /> Parcial
                  </Label>

                  <Label htmlFor="unable" className="flex items-center gap-2">
                    <RadioGroupItem value="unable" id="unable" />
                    <X className="h-4 w-4 text-red-600" /> No realizado
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Cantidad de agua y duración */}
            {report.completionStatus !== "unable" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="waterAmount">Cantidad de agua</Label>
                  <select
                    id="waterAmount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={report.waterAmount}
                    onChange={(e) =>
                      setReport((prev) => ({
                        ...prev,
                        waterAmount: e.target.value,
                      }))
                    }
                  >
                    <option value="">Seleccionar</option>
                    <option value="low">Ligera (5-10L)</option>
                    <option value="medium">Moderada (10-20L)</option>
                    <option value="high">Abundante (20-30L)</option>
                    <option value="intensive">Intensiva (30L+)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duración del riego</Label>
                  <select
                    id="duration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={report.duration}
                    onChange={(e) =>
                      setReport((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                  >
                    <option value="">Seleccionar</option>
                    <option value="short">Corta (5-10 min)</option>
                    <option value="medium">Media (10-20 min)</option>
                    <option value="long">Prolongada (20-30 min)</option>
                    <option value="extended">Extendida (30+ min)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Condición del árbol */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Condición del árbol *
              </Label>
              <RadioGroup
                value={report.treeCondition}
                onValueChange={(value: string) =>
                  setReport((prev) => ({ ...prev, treeCondition: value as any }))
                }
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Label htmlFor="excellent" className="flex items-center gap-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    Excelente
                  </Label>
                  <Label htmlFor="good" className="flex items-center gap-2">
                    <RadioGroupItem value="good" id="good" />
                    Bueno
                  </Label>
                  <Label htmlFor="fair" className="flex items-center gap-2">
                    <RadioGroupItem value="fair" id="fair" />
                    Regular
                  </Label>
                  <Label htmlFor="poor" className="flex items-center gap-2">
                    <RadioGroupItem value="poor" id="poor" />
                    Malo
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones *</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Describe el riego, suelo, condición, etc."
                value={report.notes}
                onChange={(e) =>
                  setReport((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>

            {/* Problemas */}
            <div className="space-y-2">
              <Label htmlFor="issues">Problemas encontrados</Label>
              <Textarea
                id="issues"
                rows={3}
                placeholder="Describe si hubo plagas, daños, etc."
                value={report.issues}
                onChange={(e) =>
                  setReport((prev) => ({ ...prev, issues: e.target.value }))
                }
              />
            </div>

            {/* Recomendaciones */}
            <div className="space-y-2">
              <Label htmlFor="recommendations">
                Recomendaciones para el siguiente mantenimiento
              </Label>
              <Textarea
                id="recommendations"
                rows={3}
                placeholder="Sugerencias para el próximo riego"
                value={report.recommendations}
                onChange={(e) =>
                  setReport((prev) => ({
                    ...prev,
                    recommendations: e.target.value,
                  }))
                }
              />
            </div>

            {/* Foto de evidencia */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Evidencia fotográfica *
              </Label>
              {!photoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Sube una foto del árbol después del riego
                  </p>
                  <label
                    htmlFor="photo-upload"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700"
                  >
                    <Upload className="h-4 w-4" /> Subir Foto
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Evidencia"
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removePhoto}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>

          <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <DialogTrigger asChild>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={!isFormValid() || isSubmitting}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isSubmitting ? "Enviando..." : "Enviar Reporte"}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar envío</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas enviar este reporte? Una vez enviado,
                se marcará la tarea como completada.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirmar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
