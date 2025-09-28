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
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [selectedTab, setSelectedTab] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error en login");
        return;
      }

      // 🚨 Validar si el rol del usuario coincide con la pestaña seleccionada
      if (
        (selectedTab === "user" && data.usuario.rol !== "Cliente") ||
        (selectedTab === "admin" && data.usuario.rol !== "Administrador") ||
        (selectedTab === "technician" && data.usuario.rol !== "Técnico")
      ) {
        alert(`⚠️ Este usuario no tiene permiso para iniciar sesión como ${selectedTab}`);
        return;
      }

      // Guardar token y rol
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.usuario.rol);

      alert(`Bienvenido ${data.usuario.nombre} (${data.usuario.rol})`);

      // Redirigir según rol
      if (data.usuario.rol === "Administrador") {
        onNavigate("AdminDashboard");
      } else if (data.usuario.rol === "Técnico") {
        onNavigate("technicianView");
      } else {
        onNavigate("MapView");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  const userTypes = {
    user: {
      icon: User,
      title: 'Usuario',
      description: 'Accede para adoptar y cuidar árboles',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    admin: {
      icon: Shield,
      title: 'Administrador',
      description: 'Panel de administración completo',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    technician: {
      icon: Wrench,
      title: 'Técnico',
      description: 'Gestión de mantenimiento y tareas',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
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
                <TabsTrigger value="user"><User className="h-4 w-4 mr-1" />Usuario</TabsTrigger>
                <TabsTrigger value="admin"><Shield className="h-4 w-4 mr-1" />Admin</TabsTrigger>
                <TabsTrigger value="technician"><Wrench className="h-4 w-4 mr-1" />Técnico</TabsTrigger>
              </TabsList>

              {Object.entries(userTypes).map(([type, config]) => (
                <TabsContent key={type} value={type} className="space-y-4">
                  <div className={`${config.bgColor} p-4 rounded-lg border`}>
                    <div className="flex items-center mb-2">
                      <config.icon className={`h-5 w-5 ${config.color} mr-2`} />
                      <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
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

            <div className="text-center">
              <Button variant="link" onClick={() => onNavigate('register')}>
                ¿No tienes cuenta? Regístrate aquí
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
