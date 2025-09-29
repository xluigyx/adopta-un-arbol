import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import MapView from './components/pages/MapView';
import { SpeciesPage } from './components/pages/SpeciesPage';
import { UserProfile } from './components/pages/UserProfile';
import { CreditsPage } from './components/pages/CreditsPage';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { TechnicianView } from './components/pages/TechnicianView';
import { HistoryPage } from './components/pages/HistoryPage';
import { StatisticsPage } from './components/pages/StatisticsPage';

<<<<<<< Updated upstream
// Mock user data - in a real app this would come from authentication
const mockUsers = {
  admin: {
    name: 'Admin Usuario',
    email: 'admin@arbolitos.org',
    role: 'admin' as const,
    joinDate: '2023-01-15',
    credits: 100
  },
  technician: {
    name: 'Juan Técnico',
    email: 'juan@arbolitos.org',
    role: 'technician' as const,
    joinDate: '2023-03-20',
    credits: 25
  },
  user: {
    name: 'María García',
    email: 'maria@email.com',
    role: 'user' as const,
    joinDate: '2024-01-15',
    credits: 15
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState<typeof mockUsers[keyof typeof mockUsers] | null>(null);
=======
// 🔹 Tipos de usuario
export type UserRole = 'admin' | 'technician' | 'user';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  credits: number;
}

// 🔹 Props para LocalMapView
interface MapViewProps {
  onNavigate: (view: string) => void;
  user?: User;
}

// 🔹 Componente LocalMapView
export const LocalMapView: React.FC<MapViewProps> = ({ onNavigate, user }) => {
  return (
    <div>
      {/* Aquí va tu contenido de mapa */}
      <h2>Mapa {user ? `de ${user.name}` : '(visitante)'}</h2>
    </div>
  );
};

// 🔹 Componente principal App
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
>>>>>>> Stashed changes

  const handleNavigate = (view: string) => {
    // Handle navigation to login/register pages
    if (view === 'login' || view === 'register') {
      setCurrentView(view);
      return;
    }

    // Logout
    if (view === 'logout') {
      setCurrentUser(null);
      setCurrentView('home');
      return;
    }

    // Role-based view access control
    if (currentUser) {
      switch (currentUser.role) {
        case 'admin':
          // Admin can access: admin-dashboard, map (to add trees)
          if (['admin-dashboard', 'map'].includes(view)) {
            setCurrentView(view);
          }
          break;
        case 'technician':
          // Technician can access: technician-dashboard, assigned-trees, reports, map (to see tree locations)
          if (['technician-dashboard', 'assigned-trees', 'reports', 'map'].includes(view)) {
            setCurrentView(view);
          }
          break;
        case 'user':
<<<<<<< Updated upstream
          // Regular users can access: map, species, profile, credits, history
          if (['map', 'species', 'profile', 'credits', 'history'].includes(view)) {
            setCurrentView(view);
          }
=======
          if (['map', 'species', 'profile', 'credits', 'history', 'statistics'].includes(view)) setCurrentView(view);
>>>>>>> Stashed changes
          break;
      }
    } else {
      // Not logged in, can only access public views
      if (['home', 'map', 'species', 'login', 'register'].includes(view)) {
        setCurrentView(view);
      }
    }
  };

<<<<<<< Updated upstream
  const handleLogin = (userType: 'user' | 'admin' | 'technician', credentials: { email: string; password: string }) => {
    // In a real app, this would validate credentials with a backend
    console.log('Login attempt:', userType, credentials);
    
    // Simulate successful login
    setCurrentUser(mockUsers[userType]);
    
    // Navigate based on user role
    switch (userType) {
      case 'admin':
        setCurrentView('admin-dashboard');
        break;
      case 'technician':
        setCurrentView('technician-dashboard');
        break;
      case 'user':
        setCurrentView('map');
        break;
=======
  // 🔹 Manejar login
  const handleLogin = async (
    userType: UserRole,
    credentials: { email: string; password: string }
  ) => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.usuario.rol);

      const mappedRole: UserRole =
        data.usuario.rol === "Administrador"
          ? "admin"
          : data.usuario.rol === "Técnico"
          ? "technician"
          : "user";

      const loggedUser: User = {
        name: data.usuario.nombre,
        email: data.usuario.correo,
        role: mappedRole,
        joinDate: new Date().toISOString().split("T")[0],
        credits: 10,
      };

      setCurrentUser(loggedUser);

      switch (mappedRole) {
        case 'admin':
          setCurrentView('admin-dashboard');
          break;
        case 'technician':
          setCurrentView('technician-dashboard');
          break;
        case 'user':
          setCurrentView('map');
          break;
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
>>>>>>> Stashed changes
    }
  };

  const handleRegister = (userData: any) => {
<<<<<<< Updated upstream
    // In a real app, this would create a new user account
    console.log('Registration:', userData);
    
    // Simulate successful registration - create new user
    const newUser = {
=======
    const newUser: User = {
>>>>>>> Stashed changes
      name: userData.name,
      email: userData.email,
      role: 'user',
      joinDate: userData.joinDate,
      credits: userData.credits,
      profile: userData.profile
    };
    
    setCurrentUser(newUser);
    setCurrentView('map'); // New users go to map
  };

  const renderCurrentView = () => {
    // Authentication views (no user required)
    if (currentView === 'login') {
      return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
    
    if (currentView === 'register') {
      return <RegisterPage onNavigate={handleNavigate} onRegister={handleRegister} />;
    }

    // If not logged in, show limited views
    if (!currentUser) {
      switch (currentView) {
        case 'home':
          return <LandingPage onNavigate={handleNavigate} />;
        case 'map':
          return <LocalMapView onNavigate={handleNavigate} />;
        case 'species':
          return <SpeciesPage onNavigate={handleNavigate} />;
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    }

    // Role-specific views
    switch (currentUser.role) {
      case 'admin':
        switch (currentView) {
          case 'admin-dashboard':
            return <AdminDashboard onNavigate={handleNavigate} />;
          case 'map':
            return <LocalMapView onNavigate={handleNavigate} user={currentUser} />;
          default:
            return <AdminDashboard onNavigate={handleNavigate} />;
        }

      case 'technician':
        switch (currentView) {
          case 'technician-dashboard':
            return <TechnicianView onNavigate={handleNavigate} user={currentUser} />;
          case 'map':
            return <MapView onNavigate={handleNavigate} user={currentUser} />;
          default:
            return <TechnicianView onNavigate={handleNavigate} user={currentUser} />;
        }

      case 'user':
        switch (currentView) {
          case 'map':
            return <MapView onNavigate={handleNavigate} user={currentUser} />;
          case 'species':
            return <SpeciesPage onNavigate={handleNavigate} />;
          case 'profile':
            return <UserProfile onNavigate={handleNavigate} user={currentUser} />;
          case 'credits':
            return <CreditsPage onNavigate={handleNavigate} user={currentUser} />;
          case 'history':
<<<<<<< Updated upstream
            return <HistoryPage onNavigate={handleNavigate} />;
=======
            return <HistoryPage onNavigate={handleNavigate} user={currentUser} />;
          case 'statistics':
            return <StatisticsPage onNavigate={handleNavigate} user={currentUser as User} />;
>>>>>>> Stashed changes
          default:
            return <MapView onNavigate={handleNavigate} user={currentUser} />;
        }

      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  // Don't show header/footer on login/register pages for cleaner experience
  const showHeaderFooter = !['login', 'register'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && (
        <Header 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          user={currentUser}
        />
      )}
      
      <main className={showHeaderFooter ? "flex-1" : "min-h-screen"}>
        {renderCurrentView()}
      </main>
      
      {showHeaderFooter && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
<<<<<<< Updated upstream
}
=======
};

export default App;

interface HistoryPageProps {
  onNavigate: (view: string) => void;
  user: User;
}

// Agrega la interfaz para StatisticsPage
interface StatisticsPageProps {
  onNavigate: (view: string) => void;
  user: User;
}
>>>>>>> Stashed changes
