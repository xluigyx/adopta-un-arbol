import { useState } from 'react';
import { Button } from '../ui/button';
import { Menu, X, TreePine, User, LogIn, Shield, Wrench, MapPin, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user?: {
    name: string;
    role: 'user' | 'admin' | 'technician';
  } | null;
}

export function Header({ currentView, onNavigate, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Different navigation items based on user role
  const getNavItems = () => {
    if (!user) {
      // Public navigation
      return [
        { id: 'home', label: 'Inicio', icon: null },
        { id: 'map', label: 'Mapa', icon: null },
        { id: 'species', label: 'Especies', icon: null },
      ];
    }

    switch (user.role) {
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Panel de Control', icon: Shield },
          { id: 'map', label: 'Mapa (Agregar Árboles)', icon: MapPin },
        ];
      case 'technician':
        return [
          { id: 'technician-dashboard', label: 'Mis Tareas', icon: Wrench },
          { id: 'map', label: 'Mapa', icon: MapPin },
        ];
      case 'user':
        return [
          { id: 'map', label: 'Mapa', icon: null },
          { id: 'species', label: 'Especies', icon: null },
          { id: 'history', label: 'Historial', icon: null },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'technician': return 'Técnico';
      case 'user': return 'Usuario';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-50';
      case 'technician': return 'text-blue-600 bg-blue-50';
      case 'user': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <header className="bg-white border-b border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate(user ? (user.role === 'admin' ? 'admin-dashboard' : user.role === 'technician' ? 'technician-dashboard' : 'map') : 'home')}
          >
            <TreePine className="h-8 w-8 text-green-600" />
            <span className="font-bold text-xl text-green-800">Arbolitos</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                    currentView === item.id
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Role indicator */}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </div>
                
                {/* User profile button - only for regular users */}
                {user.role === 'user' && (
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate('profile')}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                )}

                {/* Admin/Technician name display */}
                {(user.role === 'admin' || user.role === 'technician') && (
                  <span className="text-gray-700 font-medium">{user.name}</span>
                )}

                {/* Logout button */}
                <Button
                  variant="outline"
                  onClick={() => onNavigate('logout')}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onNavigate('login')}
                  className="flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Iniciar Sesión</span>
                </Button>
                <Button
                  onClick={() => onNavigate('register')}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <User className="h-4 w-4" />
                  <span>Registrarse</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                <div className="flex items-center space-x-2 mb-6">
                  <TreePine className="h-6 w-6 text-green-600" />
                  <span className="font-bold text-lg text-green-800">Arbolitos</span>
                </div>
                
                {user && (
                  <div className={`px-3 py-2 rounded-lg ${getRoleColor(user.role)}`}>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs opacity-75">{getRoleLabel(user.role)}</div>
                  </div>
                )}
                
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {Icon && <Icon className="h-4 w-4 mr-2" />}
                      {item.label}
                    </Button>
                  );
                })}
                
                <div className="border-t pt-4">
                  {user ? (
                    <>
                      {user.role === 'user' && (
                        <Button
                          variant="ghost"
                          className="justify-start w-full mb-2"
                          onClick={() => {
                            onNavigate('profile');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Mi Perfil
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="justify-start w-full"
                        onClick={() => {
                          onNavigate('logout');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          onNavigate('login');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Iniciar Sesión
                      </Button>
                      <Button
                        className="w-full justify-start bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          onNavigate('register');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Registrarse
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}