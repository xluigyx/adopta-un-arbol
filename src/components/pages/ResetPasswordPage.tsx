import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TreePine } from "lucide-react";
import API_BASE_URL from "../../config/api";

interface ResetPasswordPageProps {
  onNavigate: (view: string) => void;
}

export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
  const token =
    new URLSearchParams(window.location.search).get("token") || "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("${API_BASE_URL}/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.msg || "Error al resetear contraseña");
        return;
      }

      setMessage("Contraseña actualizada con éxito ✅");
      setTimeout(() => onNavigate("login"), 2000); // redirige al login
    } catch (err) {
      console.error(err);
      setMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-center">
            <TreePine className="h-6 w-6 mr-2 text-green-600" />
            Nueva Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label>Nueva contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Guardar contraseña
            </Button>
          </form>
          {message && (
            <p className="mt-4 text-sm text-gray-700 text-center">{message}</p>
          )}
          <Button
            variant="link"
            className="mt-4 w-full"
            onClick={() => onNavigate("login")}
          >
            ← Volver al login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
