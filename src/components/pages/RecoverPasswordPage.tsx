import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TreePine } from "lucide-react";

interface RecoverPasswordPageProps {
  onNavigate: (view: string) => void;
}

export function RecoverPasswordPage({ onNavigate }: RecoverPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/password/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.msg || "Error en la recuperación");
        return;
      }

      // En demo mostramos el link
      setMessage(
        `Se generó un link de recuperación: ${data.link} (cópialo en tu navegador)`
      );
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
            Recuperar Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRecover} className="space-y-4">
            <div>
              <Label>Correo electrónico</Label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Enviar link de recuperación
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
