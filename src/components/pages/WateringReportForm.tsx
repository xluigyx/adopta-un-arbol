import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Droplets, Camera, MapPin, Calendar, Upload, CheckCircle, 
  AlertTriangle, TreePine, FileText, X
} from 'lucide-react';

interface WateringTask {
  id: string;
  treeId: string;
  treeName: string;
  location: string;
  requesterName: string;
  requesterEmail?: string;
  urgency: 'low' | 'medium' | 'high';
  requestDate: string;
  dueDate: string;
  status: 'assigned' | 'in-progress' | 'completed';
  notes: string;
  specialInstructions?: string;
}

interface WateringReport {
  taskId: string;
  completionStatus: 'full' | 'partial' | 'unable';
  waterAmount: string;
  duration: string;
  treeCondition: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
  issues: string;
  recommendations: string;
  photoEvidence: File | null;
  completedAt: string;
}

interface WateringReportFormProps {
  task: WateringTask;
  onSubmit: (report: WateringReport) => void;
  onCancel: () => void;
}

// We need to make the interface compatible with the actual WateringRequest from TechnicianView

export function WateringReportForm({ task, onSubmit, onCancel }: WateringReportFormProps) {
  const [report, setReport] = useState<Partial<WateringReport>>({
    taskId: task.id,
    completionStatus: undefined,
    waterAmount: '',
    duration: '',
    treeCondition: undefined,
    notes: '',
    issues: '',
    recommendations: '',
    photoEvidence: null,
    completedAt: new Date().toISOString()
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReport(prev => ({ ...prev, photoEvidence: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setReport(prev => ({ ...prev, photoEvidence: null }));
    setPhotoPreview(null);
  };

  const isFormValid = () => {
    return report.completionStatus && 
           report.treeCondition && 
           report.notes?.trim() && 
           report.photoEvidence;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(report as WateringReport);
      setShowSubmitDialog(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="mb-4"
          >
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-green-900 mb-2">Reporte de Riego</h1>
          <p className="text-gray-600">Completa el formulario después de realizar el riego</p>
        </div>

        {/* Task Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              Información de la Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-1">{task.treeName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{task.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getUrgencyColor(task.urgency)}>
                    {getUrgencyText(task.urgency)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Fecha límite:</span>
                    <span className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Solicitado por:</span>
                    <span className="font-medium ml-1">{task.requesterName}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Notas del solicitante:</h4>
                  <p className="text-sm text-gray-600">{task.notes}</p>
                </div>
                
                {task.specialInstructions && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Instrucciones especiales:</h4>
                    <p className="text-sm text-blue-700">{task.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Watering Report Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Reporte de Riego
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Completion Status */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Estado de Completado *</Label>
              <RadioGroup 
                value={report.completionStatus} 
                onValueChange={(value) => setReport(prev => ({ ...prev, completionStatus: value as any }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Riego Completado Totalmente
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="partial" />
                  <Label htmlFor="partial" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Riego Parcial (con limitaciones)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unable" id="unable" />
                  <Label htmlFor="unable" className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-600" />
                    No se pudo completar el riego
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Water Details */}
            {report.completionStatus !== 'unable' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="waterAmount">Cantidad de Agua Aplicada</Label>
                  <select
                    id="waterAmount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={report.waterAmount}
                    onChange={(e) => setReport(prev => ({ ...prev, waterAmount: e.target.value }))}
                  >
                    <option value="">Seleccionar cantidad</option>
                    <option value="low">Riego Ligero (5-10L)</option>
                    <option value="medium">Riego Moderado (10-20L)</option>
                    <option value="high">Riego Abundante (20-30L)</option>
                    <option value="intensive">Riego Intensivo (30L+)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duración del Riego</Label>
                  <select
                    id="duration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={report.duration}
                    onChange={(e) => setReport(prev => ({ ...prev, duration: e.target.value }))}
                  >
                    <option value="">Seleccionar duración</option>
                    <option value="short">Corto (5-10 min)</option>
                    <option value="medium">Moderado (10-20 min)</option>
                    <option value="long">Prolongado (20-30 min)</option>
                    <option value="extended">Extendido (30+ min)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tree Condition */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Condición del Árbol Después del Riego *</Label>
              <RadioGroup 
                value={report.treeCondition} 
                onValueChange={(value) => setReport(prev => ({ ...prev, treeCondition: value as any }))}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <Label htmlFor="excellent" className="text-green-700">Excelente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good" className="text-green-600">Bueno</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="fair" />
                    <Label htmlFor="fair" className="text-yellow-600">Regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="poor" />
                    <Label htmlFor="poor" className="text-red-600">Malo</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones del Riego *</Label>
              <Textarea
                id="notes"
                placeholder="Describe cómo fue el proceso de riego, condición del suelo, respuesta del árbol, etc."
                value={report.notes}
                onChange={(e) => setReport(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Issues */}
            <div className="space-y-2">
              <Label htmlFor="issues">Problemas Identificados</Label>
              <Textarea
                id="issues"
                placeholder="Describe cualquier problema encontrado (plagas, enfermedades, daños, etc.)"
                value={report.issues}
                onChange={(e) => setReport(prev => ({ ...prev, issues: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recomendaciones para Próximo Mantenimiento</Label>
              <Textarea
                id="recommendations"
                placeholder="Sugerencias para el próximo riego o cuidado del árbol"
                value={report.recommendations}
                onChange={(e) => setReport(prev => ({ ...prev, recommendations: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Photo Evidence */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Evidencia Fotográfica *</Label>
              <div className="space-y-4">
                {!photoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-gray-600">Sube una foto del árbol después del riego</p>
                      <p className="text-sm text-gray-500">La foto es obligatoria como evidencia del trabajo realizado</p>
                    </div>
                    <label htmlFor="photo-upload" className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700">
                      <Upload className="h-4 w-4" />
                      Subir Foto
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Evidencia del riego"
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
                    <div className="mt-2 text-center">
                      <label htmlFor="photo-replace" className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        Cambiar foto
                      </label>
                      <input
                        id="photo-replace"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
          
          <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <DialogTrigger asChild>
              <Button 
                className="flex-1" 
                disabled={!isFormValid()}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Enviar Reporte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Envío de Reporte</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">
                  ¿Estás seguro de que quieres enviar este reporte? Una vez enviado, 
                  la tarea se marcará como completada.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowSubmitDialog(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    Confirmar Envío
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}