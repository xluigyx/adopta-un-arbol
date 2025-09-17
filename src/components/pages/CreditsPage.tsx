import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Coins, CreditCard, Smartphone, QrCode, Check, Gift, Star, Upload, Camera, X, AlertTriangle } from 'lucide-react';

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
  onNavigate: (view: string) => void;
  user: {
    name: string;
    credits: number;
  };
}

export function CreditsPage({ onNavigate, user }: CreditsPageProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'digital' | 'qr'>('card');
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const creditPackages: CreditPackage[] = [
    {
      id: 'starter',
      name: 'Paquete Inicial',
      credits: 10,
      price: 5,
      description: 'Perfecto para adoptar tu primer árbol'
    },
    {
      id: 'family',
      name: 'Paquete Familiar',
      credits: 25,
      price: 10,
      originalPrice: 12.5,
      bonus: 3,
      description: 'Ideal para familias comprometidas con el ambiente'
    },
    {
      id: 'community',
      name: 'Paquete Comunidad',
      credits: 50,
      price: 18,
      originalPrice: 25,
      popular: true,
      bonus: 8,
      description: 'Para comunidades que quieren hacer un gran impacto'
    },
    {
      id: 'enterprise',
      name: 'Paquete Empresa',
      credits: 100,
      price: 30,
      originalPrice: 50,
      bonus: 20,
      description: 'Para empresas con responsabilidad social'
    }
  ];

  const selectedPkg = creditPackages.find(pkg => pkg.id === selectedPackage);

  const handlePurchase = () => {
    if (paymentMethod === 'qr') {
      // Para pago con QR, mostrar formulario de comprobante
      setShowPaymentProof(true);
    } else {
      // Para otros métodos, proceso normal
      setShowPurchaseDialog(true);
      setIsProcessingPayment(true);
      setTimeout(() => {
        setShowPurchaseDialog(false);
        setIsProcessingPayment(false);
        alert(`¡Compra exitosa! Se han agregado ${selectedPkg?.credits} créditos a tu cuenta.`);
      }, 2000);
    }
  };

  const handlePaymentProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentProofPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePaymentProof = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
  };

  const submitPaymentProof = () => {
    if (paymentProof) {
      setShowPaymentProof(false);
      setShowPurchaseDialog(true);
      setIsProcessingPayment(true);
      
      // Simular proceso de verificación de comprobante
      setTimeout(() => {
        setShowPurchaseDialog(false);
        setIsProcessingPayment(false);
        alert(`¡Comprobante recibido! Tu pago será verificado en las próximas 24 horas. Se agregarán ${selectedPkg?.credits} créditos una vez confirmado.`);
        
        // Reset form
        setPaymentProof(null);
        setPaymentProofPreview(null);
        setPaymentNotes('');
      }, 3000);
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
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-green-900">Compra Créditos</h3>
                <p className="text-sm text-gray-600">
                  Elige el paquete que mejor se adapte a tus necesidades
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-green-900">Adopta Árboles</h3>
                <p className="text-sm text-gray-600">
                  Usa 1 crédito para adoptar cada árbol que te guste
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-green-900">Recibe Actualizaciones</h3>
                <p className="text-sm text-gray-600">
                  Mantente informado sobre el crecimiento de tus árboles
                </p>
              </div>
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
                    ? 'ring-2 ring-green-500 shadow-lg' 
                    : 'hover:shadow-md'
                } ${pkg.popular ? 'border-green-300' : ''}`}
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
                      ${pkg.price}
                      {pkg.originalPrice && (
                        <span className="text-lg text-gray-400 line-through ml-2">
                          ${pkg.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-semibold text-green-900">
                      {pkg.credits} créditos
                      {pkg.bonus && (
                        <span className="text-sm text-green-600 block">
                          + {pkg.bonus} bonus
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    {pkg.description}
                  </p>
                  
                  <div className="text-center">
                    {pkg.originalPrice && (
                      <Badge className="bg-green-100 text-green-800 mb-2">
                        Ahorra ${(pkg.originalPrice - pkg.price).toFixed(2)}
                      </Badge>
                    )}
                    <div className="text-xs text-gray-500">
                      ${(pkg.price / pkg.credits).toFixed(2)} por crédito
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

        {/* Payment Method */}
        {selectedPackage && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Tarjeta de Crédito/Débito</div>
                        <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="digital" id="digital" />
                    <Label htmlFor="digital" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Billetera Digital</div>
                        <div className="text-sm text-gray-500">PayPal, Apple Pay, Google Pay</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="qr" id="qr" />
                    <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer flex-1">
                      <QrCode className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Código QR</div>
                        <div className="text-sm text-gray-500">Pago mediante código QR</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

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
                  <span>${selectedPkg.price}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Total de créditos:</span>
                  <span className="font-medium">
                    {selectedPkg.credits + (selectedPkg.bonus || 0)}
                  </span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handlePurchase}>
                <Coins className="mr-2 h-5 w-5" />
                Proceder al Pago
              </Button>

              {/* Payment Proof Dialog for QR payments */}
              <Dialog open={showPaymentProof} onOpenChange={setShowPaymentProof}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-purple-600" />
                      Comprobante de Pago - Código QR
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-900 mb-1">Instrucciones de Pago</h4>
                          <p className="text-sm text-purple-700 mb-2">
                            1. Realiza el pago de <strong>${selectedPkg?.price}</strong> usando el código QR proporcionado
                          </p>
                          <p className="text-sm text-purple-700 mb-2">
                            2. Toma una captura de pantalla del comprobante de pago exitoso
                          </p>
                          <p className="text-sm text-purple-700">
                            3. Súbela aquí junto con cualquier nota adicional
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Comprobante de Pago *</Label>
                        <p className="text-sm text-gray-600">
                          Sube una imagen clara del comprobante de pago (captura de pantalla, foto, etc.)
                        </p>
                      </div>

                      {!paymentProofPreview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <div className="space-y-2">
                            <p className="text-gray-600">Subir comprobante de pago</p>
                            <p className="text-sm text-gray-500">PNG, JPG hasta 10MB</p>
                          </div>
                          <label htmlFor="proof-upload" className="mt-4 inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-700">
                            <Upload className="h-4 w-4" />
                            Seleccionar Archivo
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
                            alt="Comprobante de pago"
                            className="w-full max-w-md mx-auto rounded-lg shadow-md"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={removePaymentProof}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="mt-2 text-center">
                            <label htmlFor="proof-replace" className="text-sm text-purple-600 hover:text-purple-800 cursor-pointer">
                              Cambiar imagen
                            </label>
                            <input
                              id="proof-replace"
                              type="file"
                              accept="image/*"
                              onChange={handlePaymentProofUpload}
                              className="hidden"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-notes">Notas Adicionales (Opcional)</Label>
                      <Textarea
                        id="payment-notes"
                        placeholder="Número de transacción, hora del pago, o cualquier información adicional..."
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900 mb-1">Tiempo de Verificación</h4>
                          <p className="text-sm text-yellow-700">
                            Tu comprobante será verificado en un plazo de 24 horas. 
                            Los créditos se agregarán a tu cuenta una vez confirmado el pago.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPaymentProof(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={submitPaymentProof}
                        disabled={!paymentProof}
                        className="flex-1"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Enviar Comprobante
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Processing Payment Dialog */}
              <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {paymentMethod === 'qr' ? 'Verificando Comprobante...' : 'Procesando Pago...'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-8 text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600">
                      {paymentMethod === 'qr' 
                        ? 'Por favor espera mientras verificamos tu comprobante de pago.'
                        : 'Por favor espera mientras procesamos tu pago de forma segura.'
                      }
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="text-xs text-gray-500 text-center">
                <p>
                  Al proceder con la compra, aceptas nuestros términos y condiciones.
                  Los créditos no son reembolsables y no tienen fecha de vencimiento.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedPackage && (
          <div className="text-center py-8">
            <Coins className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Selecciona un Paquete
            </h3>
            <p className="text-gray-500">
              Elige el paquete de créditos que mejor se adapte a tus necesidades
            </p>
          </div>
        )}
      </div>
    </div>
  );
}