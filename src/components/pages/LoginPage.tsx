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
  onLogin: (
    userType: 'user' | 'admin' | 'technician',
    credentials: { email: string; password: string }
  ) => void | Promise<void>;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [selectedTab, setSelectedTab] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedTab as 'user' | 'admin' | 'technician', credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <CardDescription>Selecciona tu tipo de usuario para acceder</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="user">Usuario</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="technician">Técnico</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab}>
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
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => onNavigate('register')}
                className="text-sm text-gray-600 hover:text-green-600"
              >
                ¿No tienes cuenta? Regístrate aquí
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
