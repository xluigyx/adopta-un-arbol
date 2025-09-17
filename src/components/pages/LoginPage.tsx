import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { TreePine, Shield, Wrench, User, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (view: string) => void;
  onLogin: (userType: 'user' | 'admin' | 'technician', credentials: { email: string; password: string }) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [selectedTab, setSelectedTab] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedTab as 'user' | 'admin' | 'technician', credentials);
  };

  const handleQuickLogin = (userType: 'user' | 'admin' | 'technician') => {
    const quickCredentials = {
      user: { email: 'maria@email.com', password: 'demo123' },
      admin: { email: 'admin@arbolitos.org', password: 'admin123' },
      technician: { email: 'juan@arbolitos.org', password: 'tech123' }
    };
    
    setCredentials(quickCredentials[userType]);
    onLogin(userType, quickCredentials[userType]);
  };

  const userTypes = {
    user: {
      icon: User,
      title: 'Usuario',
      description: 'Accede para adoptar y cuidar árboles',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      demoUser: 'María García (Usuario Regular)'
    },
    admin: {
      icon: Shield,
      title: 'Administrador',
      description: 'Panel de administración completo',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      demoUser: 'Admin Usuario (Administrador)'
    },
    technician: {
      icon: Wrench,
      title: 'Técnico',
      description: 'Gestión de mantenimiento y tareas',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      demoUser: 'Juan Técnico (Técnico de Campo)'
    }
  };

  const currentUserType = userTypes[selectedTab as keyof typeof userTypes];
  const Icon = currentUserType.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <TreePine className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Arbolitos</h1>
          <p className="text-gray-600">Adopción y cuidado de árboles urbanos</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Selecciona tu tipo de usuario para acceder
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="user" className="text-xs sm:text-sm">
                  <User className="h-4 w-4 mr-1" />
                  Usuario
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs sm:text-sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="technician" className="text-xs sm:text-sm">
                  <Wrench className="h-4 w-4 mr-1" />
                  Técnico
                </TabsTrigger>
              </TabsList>

              {Object.entries(userTypes).map(([type, config]) => (
                <TabsContent key={type} value={type} className="space-y-4">
                  {/* User Type Info */}
                  <div className={`${config.bgColor} p-4 rounded-lg border`}>
                    <div className="flex items-center mb-2">
                      <config.icon className={`h-5 w-5 ${config.color} mr-2`} />
                      <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                    
                    {/* Demo Login Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickLogin(type as 'user' | 'admin' | 'technician')}
                      className="w-full"
                    >
                      <span className="text-xs">Acceso rápido como: {config.demoUser}</span>
                    </Button>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={credentials.password}
                          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      <Icon className="h-4 w-4 mr-2" />
                      Iniciar Sesión como {config.title}
                    </Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>

            <Separator className="my-6" />

            {/* Additional Options */}
            <div className="space-y-3 text-center">
              <Button
                variant="link"
                className="text-sm text-gray-600 hover:text-green-600"
                onClick={() => onNavigate('register')}
              >
                ¿No tienes cuenta? Regístrate aquí
              </Button>
              
              <div className="text-xs text-gray-500">
                <p>¿Olvidaste tu contraseña?</p>
                <Button variant="link" className="text-xs p-0 h-auto text-green-600">
                  Recuperar contraseña
                </Button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 pt-4 border-t">
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

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Demo - Usa "Acceso rápido" para probar diferentes roles</p>
        </div>
      </div>
    </div>
  );
}