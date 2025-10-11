import { Toaster } from "sonner";
import { useState } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { MapView } from "./components/pages/MapView";
import { SpeciesPage } from "./components/pages/SpeciesPage";
import { UserProfile } from "./components/pages/UserProfile";
import { CreditsPage } from "./components/pages/CreditsPage";
import { AdminDashboard } from "./components/pages/AdminDashboard";
import { TechnicianView } from "./components/pages/TechnicianView";
import { HistoryPage } from "./components/pages/HistoryPage";
import { StatisticsPage } from "./components/pages/StatisticsPage";

export default function App() {
  const [currentView, setCurrentView] = useState("home");

  // ✅ Usuario actual
  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    name: string;
    email: string;
    role: "admin" | "technician" | "user";
    joinDate: string;
    credits: number;
  } | null>(null);

  // 🔹 Cambiar de vista
  const handleNavigate = (view: string) => {
    if (view === "login" || view === "register") {
      setCurrentView(view);
      return;
    }

    if (view === "logout") {
      setCurrentUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      localStorage.removeItem("user");
      setCurrentView("home");
      return;
    }

    if (currentUser) {
      switch (currentUser.role) {
        case "admin":
          if (["admin-dashboard", "map"].includes(view)) setCurrentView(view);
          break;
        case "technician":
          if (["technician-dashboard", "map"].includes(view))
            setCurrentView(view);
          break;
        case "user":
          if (
            ["map", "species", "profile", "credits", "history", "statistics"].includes(view)
          )
            setCurrentView(view);
          break;
      }
    } else {
      if (["home", "map", "species", "login", "register"].includes(view)) {
        setCurrentView(view);
      }
    }
  };

  // 🔹 Login con backend real
  const handleLogin = async (
    userType: "user" | "admin" | "technician",
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

      const mappedRole =
        data.usuario.rol === "Administrador"
          ? "admin"
          : data.usuario.rol === "Técnico"
          ? "technician"
          : "user";

      const loggedUser = {
        _id: data.usuario.id || data.usuario._id || data.usuario?.Id || "",
        name: data.usuario.nombre,
        email: data.usuario.correo,
        role: mappedRole as "admin" | "technician" | "user",
        joinDate: new Date().toISOString().split("T")[0],
        credits: 10,
      };

      if (!loggedUser._id) {
        console.warn("⚠️ No se recibió _id del backend. Revisa tu endpoint /login.");
      }

      setCurrentUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      switch (mappedRole) {
        case "admin":
          setCurrentView("admin-dashboard");
          break;
        case "technician":
          setCurrentView("technician-dashboard");
          break;
        case "user":
          setCurrentView("map");
          break;
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  // 🔹 Registro temporal
  const handleRegister = (userData: any) => {
    const newUser = {
      _id: "temp-id",
      name: userData.name,
      email: userData.email,
      role: "user" as const,
      joinDate: userData.joinDate,
      credits: userData.credits,
    };

    setCurrentUser(newUser);
    setCurrentView("map");
  };

  // 🔹 Render según vista actual
  const renderCurrentView = () => {
    if (currentView === "login") {
      return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
    if (currentView === "register") {
      return (
        <RegisterPage onNavigate={handleNavigate} onRegister={handleRegister} />
      );
    }

    // Si no hay usuario
    if (!currentUser) {
      switch (currentView) {
        case "home":
          return <LandingPage onNavigate={handleNavigate} />;
        case "map":
          return <MapView onNavigate={handleNavigate} user={undefined} />;
        case "species":
          return <SpeciesPage onNavigate={handleNavigate} />;
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    }

    // Si hay usuario logueado
    switch (currentUser.role) {
      case "admin":
        switch (currentView) {
          case "admin-dashboard":
            return <AdminDashboard onNavigate={handleNavigate} />;
          case "map":
            return <MapView onNavigate={handleNavigate} user={currentUser} />;
          default:
            return <AdminDashboard onNavigate={handleNavigate} />;
        }

      case "technician":
        switch (currentView) {
          case "technician-dashboard":
            return (
              <TechnicianView onNavigate={handleNavigate} user={currentUser} />
            );
          case "map":
            return <MapView onNavigate={handleNavigate} user={currentUser} />;
          default:
            return (
              <TechnicianView onNavigate={handleNavigate} user={currentUser} />
            );
        }

      case "user":
        switch (currentView) {
          case "map":
            return <MapView onNavigate={handleNavigate} user={currentUser} />;
          case "species":
            return <SpeciesPage onNavigate={handleNavigate} />;
          case "profile":
            return <UserProfile onNavigate={handleNavigate} user={currentUser} />;
          case "credits":
            return <CreditsPage onNavigate={handleNavigate} user={currentUser} />;
          case "history":
            return <HistoryPage onNavigate={handleNavigate} />;
          case "statistics":
            return <StatisticsPage onNavigate={handleNavigate} />;
          default:
            return <MapView onNavigate={handleNavigate} user={currentUser} />;
        }

      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  const showHeaderFooter = !["login", "register"].includes(currentView);

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

      {showHeaderFooter && <Footer onNavigate={handleNavigate} />}

      <Toaster position="top-right" richColors />
    </div>
  );
}
