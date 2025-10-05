import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { 
  Coins, QrCode, Check, Gift, Star, Upload, Camera, X, AlertTriangle 
} from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  bonus?: number;
  description: string;
}

interface CreditsPageProps {
  onNavigate?: (view: string) => void; // 🔹 Agregado para navegación
  user: {
    _id: string;
    name: string;
    credits: number;
  };
}


export function CreditsPage({ user }: CreditsPageProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 🔹 Estados para QR del admin
  const [adminQR, setAdminQR] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(true);

  // 🔹 Cargar QR del admin desde el backend
  useEffect(() => {
    const fetchAdminQR = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/qr");
        const data = await res.json();
        if (data.success) {
          setAdminQR(`http://localhost:4000${data.imageUrl}`);
        }
      } catch (error) {
        console.error("Error cargando QR del admin:", error);
      } finally {
        setIsLoadingQR(false);
      }
    };
    fetchAdminQR();
  }, []);

  // 🔹 Paquetes en bolivianos
  const creditPackages: CreditPackage[] = [
    { id: 'starter', name: 'Paquete Inicial', credits: 10, price: 35, description: 'Perfecto para adoptar tu primer árbol' },
    { id: 'family', name: 'Paquete Familiar', credits: 25, price: 80, originalPrice: 100, bonus: 3, description: 'Ideal para familias comprometidas con el ambiente' },
    { id: 'community', name: 'Paquete Comunidad', credits: 50, price: 125, originalPrice: 160, popular: true, bonus: 8, description: 'Para comunidades que quieren hacer un gran impacto' },
    { id: 'enterprise', name: 'Paquete Empresa', credits: 100, price: 200, originalPrice: 300, bonus: 20, description: 'Para empresas con responsabilidad social' }
  ];

  const selectedPkg = creditPackages.find(pkg => pkg.id === selectedPackage);

  const handlePurchase = () => {
    if (!selectedPkg) return;
    setShowPaymentProof(true);
  };

  const handlePaymentProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onload = (e) => setPaymentProofPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removePaymentProof = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
  };

  // 🔹 Enviar comprobante al backend (y notificar admin)
  const submitPaymentProof = async () => {
    if (!paymentProof || !selectedPkg) return;

    setIsProcessingPayment(true);
    setShowPaymentProof(false);

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("nombreUsuario", user.name);
      formData.append("paqueteId", selectedPkg.id);
      formData.append("paqueteNombre", selectedPkg.name);
      formData.append("creditos", selectedPkg.credits.toString());
      formData.append("bonus", (selectedPkg.bonus || 0).toString());
      formData.append("precio", selectedPkg.price.toString());
      formData.append("notas", paymentNotes);
      formData.append("comprobante", paymentProof);

      const res = await fetch("http://localhost:4000/api/pago", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      alert("✅ Comprobante enviado. El administrador revisará tu pago.");
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      alert("❌ Error al enviar el comprobante. Intenta nuevamente.");
    } finally {
      setIsProcessingPayment(false);
      setPaymentProof(null);
      setPaymentProofPreview(null);
      setPaymentNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Comprar Créditos</h1>
          <p className="text-gray-600 mb-4">
            Los créditos te permiten adoptar y cuidar árboles en tu comunidad
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <Coins className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Tienes {user.credits} créditos disponibles
            </span>
          </div>
        </div>

        {/* How Credits Work */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              ¿Cómo funcionan los créditos?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 font-bold">{num}</span>
                  </div>
                  <h3 className="font-semibold text-green-900">
                    {num === 1 ? 'Compra Créditos' : num === 2 ? 'Adopta Árboles' : 'Recibe Actualizaciones'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {num === 1 ? 'Elige el paquete que mejor se adapte a tus necesidades' :
                    num === 2 ? 'Usa 1 crédito para adoptar cada árbol que te guste' :
                    'Mantente informado sobre el crecimiento de tus árboles'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Credit Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Elige tu Paquete</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? "ring-2 ring-green-500 shadow-lg"
                    : "hover:shadow-md"
                } ${pkg.popular ? "border-green-300" : ""}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="bg-green-500 text-white text-center py-1 text-sm font-medium rounded-t-lg">
                    <Star className="inline h-4 w-4 mr-1" />
                    Más Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-green-900">{pkg.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">
                      Bs {pkg.price}
                      {pkg.originalPrice && (
                        <span className="text-lg text-gray-400 line-through ml-2">
                          Bs {pkg.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-semibold text-green-900">
                      {pkg.credits} créditos
                      {pkg.bonus && (
                        <span className="text-sm text-green-600 block">+ {pkg.bonus} bonus</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">{pkg.description}</p>
                  <div className="text-center">
                    {pkg.originalPrice && (
                      <Badge className="bg-green-100 text-green-800 mb-2">
                        Ahorra Bs {(pkg.originalPrice - pkg.price).toFixed(2)}
                      </Badge>
                    )}
                    <div className="text-xs text-gray-500">
                      Bs {(pkg.price / pkg.credits).toFixed(2)} por crédito
                    </div>
                  </div>
                  {selectedPackage === pkg.id && (
                    <div className="flex justify-center">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Purchase Summary */}
        {selectedPackage && selectedPkg && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Paquete:</span>
                  <span className="font-medium">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Créditos:</span>
                  <span className="font-medium">{selectedPkg.credits}</span>
                </div>
                {selectedPkg.bonus && (
                  <div className="flex justify-between text-green-600">
                    <span>Bonus:</span>
                    <span className="font-medium">+{selectedPkg.bonus}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total a pagar:</span>
                  <span>Bs {selectedPkg.price}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handlePurchase}>
                <QrCode className="mr-2 h-5 w-5" /> Pagar con Código QR
              </Button>

              {/* Dialog QR */}
              <Dialog open={showPaymentProof} onOpenChange={setShowPaymentProof}>
               <DialogContent
  className="
    w-[95vw] sm:w-[600px] lg:w-[700px]
    max-h-[90vh] overflow-y-auto
    rounded-2xl p-6
  "
>

                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-purple-600" /> Pago con Código QR
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">

                    {/* Mostrar QR del admin */}
                    <div className="text-center">
                      {isLoadingQR ? (
                        <p className="text-gray-500">Cargando código QR...</p>
                      ) : adminQR ? (
                        <>
                          <p className="text-gray-700 mb-2">
                            Escanea este código QR para pagar Bs {selectedPkg.price}
                          </p>
                          <img
                            src={adminQR}
                            alt="QR del administrador"
                            className="w-56 h-56 mx-auto rounded-lg shadow-md border border-gray-200 object-contain"
                          />
                        </>
                      ) : (
                        <p className="text-red-500">No hay QR disponible. Contacta al administrador.</p>
                      )}
                    </div>

                    {/* Instrucciones */}
                    <div className="bg-purple-50 p-4 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900 mb-1">Instrucciones</h4>
                        <p className="text-sm text-purple-700 mb-1">1. Escanea el QR y paga Bs {selectedPkg?.price}</p>
                        <p className="text-sm text-purple-700 mb-1">2. Toma una captura o foto del comprobante</p>
                        <p className="text-sm text-purple-700">3. Sube la imagen aquí</p>
                      </div>
                    </div>

                    {/* Subir comprobante */}
                    {!paymentProofPreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Subir comprobante de pago</p>
                        <label htmlFor="proof-upload" className="mt-4 inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-700">
                          <Upload className="h-4 w-4" /> Seleccionar Archivo
                        </label>
                        <input id="proof-upload" type="file" accept="image/*" onChange={handlePaymentProofUpload} className="hidden" />
                      </div>
                    ) : (
                      <div className="relative">
                        <img src={paymentProofPreview} alt="Comprobante" className="w-full max-w-md mx-auto rounded-lg shadow-md" />
                        <Button variant="destructive" size="sm" onClick={removePaymentProof} className="absolute top-2 right-2">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="payment-notes">Notas (Opcional)</Label>
                      <Textarea
                        id="payment-notes"
                        placeholder="Número de transacción, comentarios..."
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button onClick={submitPaymentProof} disabled={!paymentProof} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Upload className="mr-2 h-4 w-4" /> Enviar Comprobante
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
