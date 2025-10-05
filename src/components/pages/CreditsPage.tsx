import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  Coins,
  QrCode,
  Check,
  Gift,
  Star,
  Upload,
  Camera,
  X,
  AlertTriangle,
} from "lucide-react";

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
  user: {
    _id: string;
    name: string;
    credits: number;
  };
}

export function CreditsPage({ user }: CreditsPageProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(
    null
  );
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [adminQR, setAdminQR] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(true);

  // 🔹 Nuevos modales visuales
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  const creditPackages: CreditPackage[] = [
    { id: "starter", name: "Paquete Inicial", credits: 10, price: 35, description: "Perfecto para adoptar tu primer árbol" },
    { id: "family", name: "Paquete Familiar", credits: 25, price: 80, originalPrice: 100, bonus: 3, description: "Ideal para familias comprometidas con el ambiente" },
    { id: "community", name: "Paquete Comunidad", credits: 50, price: 125, originalPrice: 160, popular: true, bonus: 8, description: "Para comunidades que quieren hacer un gran impacto" },
    { id: "enterprise", name: "Paquete Empresa", credits: 100, price: 200, originalPrice: 300, bonus: 20, description: "Para empresas con responsabilidad social" },
  ];

  const selectedPkg = creditPackages.find((pkg) => pkg.id === selectedPackage);

  const handlePurchase = () => {
    if (!selectedPkg) return;
    setShowPaymentProof(true);
  };

  const handlePaymentProofUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onload = (e) =>
        setPaymentProofPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removePaymentProof = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
  };

  const submitPaymentProof = async () => {
    if (!paymentProof || !selectedPkg) return;

    setIsProcessingPayment(true);

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

      // ✅ Modal visual de éxito
      setShowSuccessModal(true);
      setShowPaymentProof(false);
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      setShowErrorModal(true);
    } finally {
      setIsProcessingPayment(false);
      setPaymentProof(null);
      setPaymentProofPreview(null);
      setPaymentNotes("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900">
            Comprar Créditos
          </h1>
          <p className="text-gray-600 mt-2 mb-4">
            Usa tus créditos para adoptar y cuidar árboles 🌱
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <Coins className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              {user.credits} créditos disponibles
            </span>
          </div>
        </div>

        {/* Lista de paquetes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {creditPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? "ring-2 ring-green-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="bg-green-500 text-white text-center py-1 text-sm font-medium rounded-t-lg">
                  <Star className="inline h-4 w-4 mr-1" />
                  Más Popular
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-green-900">
                  {pkg.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-gray-600 text-sm">{pkg.description}</p>
                <div className="text-2xl font-bold text-green-700">
                  Bs {pkg.price}
                </div>
                <div className="text-gray-800 text-sm">
                  {pkg.credits} créditos{" "}
                  {pkg.bonus && (
                    <span className="text-green-600 font-semibold">
                      (+{pkg.bonus} bonus)
                    </span>
                  )}
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

        {/* Resumen y modal QR */}
        {selectedPackage && selectedPkg && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Resumen de compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Paquete:</span>
                  <span>{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Créditos:</span>
                  <span>{selectedPkg.credits}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>Bs {selectedPkg.price}</span>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handlePurchase}
              >
                <QrCode className="mr-2 h-4 w-4" /> Pagar con QR
              </Button>

              {/* Modal de pago QR */}
              <Dialog open={showPaymentProof} onOpenChange={setShowPaymentProof}>
                <DialogContent className="w-[95vw] sm:w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 border-t-8 border-green-600 shadow-xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-800">
                      <QrCode className="h-5 w-5 text-green-600" />
                      Pago con QR — {selectedPkg.name}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* QR */}
                    <div className="text-center">
                      {isLoadingQR ? (
                        <p className="text-gray-500">Cargando código QR...</p>
                      ) : adminQR ? (
                        <>
                          <p className="text-gray-700 mb-2">
                            Escanea este QR y paga{" "}
                            <strong>Bs {selectedPkg.price}</strong>
                          </p>
                          <img
                            src={adminQR}
                            alt="QR"
                            className="w-64 h-64 mx-auto rounded-lg border-2 border-green-200 shadow-lg object-contain"
                          />
                        </>
                      ) : (
                        <p className="text-red-500">
                          No hay QR disponible. Contacta al administrador.
                        </p>
                      )}
                    </div>

                    {/* Subir comprobante */}
                    {!paymentProofPreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                        <Camera className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">
                          Sube tu comprobante de pago
                        </p>
                        <label
                          htmlFor="proof-upload"
                          className="mt-3 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700"
                        >
                          <Upload className="h-4 w-4" /> Seleccionar Archivo
                        </label>
                        <input
                          id="proof-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePaymentProofUpload}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={paymentProofPreview}
                          alt="Comprobante"
                          className="w-full rounded-lg shadow-md"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={removePaymentProof}
                          className="absolute top-2 right-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={submitPaymentProof}
                      disabled={!paymentProof || isProcessingPayment}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Upload className="mr-2 h-4 w-4" />{" "}
                      {isProcessingPayment ? "Enviando..." : "Enviar comprobante"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Modal ÉXITO */}
              <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="rounded-2xl p-6 text-center bg-white border-t-8 border-green-500 shadow-xl">
                  <Check className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-2xl font-semibold text-green-800 mb-2">
                    ¡Pago enviado con éxito!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Tu comprobante fue recibido. El administrador revisará tu
                    pago pronto 🌱
                  </p>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setShowSuccessModal(false)}
                  >
                    Entendido
                  </Button>
                </DialogContent>
              </Dialog>

              {/* Modal ERROR */}
              <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
                <DialogContent className="rounded-2xl p-6 text-center bg-white border-t-8 border-red-500 shadow-xl">
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-red-800 mb-2">
                    Error al enviar
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Hubo un problema al subir tu comprobante. Inténtalo
                    nuevamente.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowErrorModal(false)}
                  >
                    Cerrar
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
