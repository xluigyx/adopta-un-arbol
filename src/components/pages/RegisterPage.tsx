import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TreePine, User, Eye, EyeOff, MapPin, Phone, Calendar } from 'lucide-react';

// ✅ Props corregidas
interface RegisterPageProps {
  onNavigate: (view: string) => void;
  onRegister: (userData: any) => void;
}

export function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    neighborhood: '',
    birthDate: '',
    motivation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPopupMessage('❌ Las contraseñas no coinciden');
      return;
    }

    if (!agreedToTerms) {
      setPopupMessage('❌ Debes aceptar los términos y condiciones');
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setPopupMessage(data.msg || "Error al registrar usuario");
        return;
      }

      // ✅ Notificar al padre (App.tsx)
      onRegister({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: 'user',
        joinDate: new Date().toISOString().split('T')[0],
        credits: 10,
        profile: {
          phone: formData.phone,
          city: formData.city,
          neighborhood: formData.neighborhood,
          birthDate: formData.birthDate,
          motivation: formData.motivation
        }
      });

      setPopupMessage("✅ Registro exitoso");
      setTimeout(() => onNavigate("login"), 2000); // redirigir al login
    } catch (err) {
      console.error(err);
      setPopupMessage("❌ Error de conexión con el servidor");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <TreePine className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Únete a Arbolitos</h1>
          <p className="text-gray-600">Comienza tu aventura cuidando árboles urbanos</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl flex items-center justify-center">
              <User className="h-6 w-6 mr-2 text-green-600" />
              Crear Cuenta
            </CardTitle>
            <CardDescription>
              Completa la información para unirte a nuestra comunidad
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="María"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="García"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="maria@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+591 700 12345"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              {/* Ciudad y Barrio */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Select onValueChange={(value: string) => handleInputChange('city', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cochabamba">Cochabamba</SelectItem>
                      <SelectItem value="la-paz">La Paz</SelectItem>
                      <SelectItem value="santa-cruz">Santa Cruz</SelectItem>
                      <SelectItem value="sucre">Sucre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Barrio</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="neighborhood"
                      placeholder="Tu barrio"
                      className="pl-10"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Fecha nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="birthDate"
                    type="date"
                    className="pl-10"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Motivación */}
              <div className="space-y-2">
                <Label htmlFor="motivation">¿Por qué quieres cuidar árboles?</Label>
                <Input
                  id="motivation"
                  placeholder="Ej: Quiero contribuir al medio ambiente..."
                  value={formData.motivation}
                  onChange={(e) => handleInputChange('motivation', e.target.value)}
                />
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                />
                <div className="text-sm leading-relaxed">
                  <Label htmlFor="terms" className="cursor-pointer">
                    Acepto los{' '}
                    <button type="button" className="text-green-600 hover:underline">
                      términos y condiciones
                    </button>{' '}
                    y la{' '}
                    <button type="button" className="text-green-600 hover:underline">
                      política de privacidad
                    </button>
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!agreedToTerms}
              >
                <TreePine className="h-4 w-4 mr-2" />
                Crear mi cuenta
              </Button>
            </form>

            {/* Popup mensaje */}
            {popupMessage && (
              <div className="mt-4 p-3 text-center text-sm bg-green-50 border rounded">
                {popupMessage}
              </div>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <Button
                variant="link"
                className="text-sm text-gray-600 hover:text-green-600"
                onClick={() => onNavigate('login')}
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
              </Button>
            </div>

            {/* Back to Home */}
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => onNavigate('home')}
                className="w-full text-gray-600 hover:text-gray-900"
              >
                ← Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info bienvenida */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-center">
            <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">¡Bienvenido a Arbolitos!</h3>
            <p className="text-sm text-green-700 mt-1">
              Recibirás 10 créditos de bienvenida para comenzar a adoptar árboles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
