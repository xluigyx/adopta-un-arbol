import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { MapView } from './components/pages/MapView';
import { SpeciesPage } from './components/pages/SpeciesPage';
import { UserProfile } from './components/pages/UserProfile';
import { CreditsPage } from './components/pages/CreditsPage';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { TechnicianView } from './components/pages/TechnicianView';
import { HistoryPage } from './components/pages/HistoryPage';
import { StatisticsPage } from './components/pages/StatisticsPage';

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
          // Regular users can access: map, species, profile, credits, history
          if (['map', 'species', 'profile', 'credits', 'history'].includes(view)) {
            setCurrentView(view);
          }
          break;
      }
    } else {
      // Not logged in, can only access public views
      if (['home', 'map', 'species', 'login', 'register'].includes(view)) {
        setCurrentView(view);
      }
    }
  };

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
    }
  };

  const handleRegister = (userData: any) => {
    // In a real app, this would create a new user account
    console.log('Registration:', userData);
    
    // Simulate successful registration - create new user
    const newUser = {
      name: userData.name,
      email: userData.email,
      role: 'user' as const,
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
          return <MapView onNavigate={handleNavigate} user={undefined} />;
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
            return <MapView onNavigate={handleNavigate} user={currentUser} />;
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
            return <HistoryPage onNavigate={handleNavigate} />;
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
}