/// <reference types="vite/client" />

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Therapist {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  therapeutic_approaches: string[];
  session_price: number;
  country: string;
  city: string;
  remote: boolean;
  on_site: boolean;
  bio: string;
  years_experience: number;
  languages: string[];
  is_active: boolean;
  created_at: string;
}

interface Session {
  id: string;
  email: string;
  created_at: string;
  questionnaire_answers: any;
  model_results_count: number;
  user_selections_count: number;
}

const API_BASE = import.meta.env.VITE_API_URL;

const AdminDashboard: React.FC = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"therapists" | "sessions">(
    "therapists"
  );
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.access_token);
        setToken(data.access_token);
      } else {
        const errorData = await response.json();
        setLoginError(errorData.detail || "Invalid credentials");
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    }
  };

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/therapists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTherapists(data);
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setToken(null);
      }
    } catch (error) {
      console.error("Failed to fetch therapists:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setToken(null);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTherapist = async (therapistId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este terapeuta?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/admin/therapists/${therapistId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTherapists(therapists.filter((t) => t.id !== therapistId));
      } else {
        alert("Error al eliminar terapeuta");
      }
    } catch (error) {
      alert("Error al eliminar terapeuta");
    }
  };

  useEffect(() => {
    if (token) {
      if (activeTab === "therapists") {
        fetchTherapists();
      } else {
        fetchSessions();
      }
    }
  }, [token, activeTab]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kuna.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              <p className="text-blue-800">
                <strong>Credenciales de prueba:</strong>
                <br />
                Email: admin@kuna.com
                <br />
                Contraseña: secret123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <Button
            onClick={() => {
              localStorage.removeItem("adminToken");
              setToken(null);
            }}
            variant="outline"
          >
            Cerrar Sesión
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("therapists")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "therapists"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Terapeutas ({therapists.length})
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sessions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Sesiones de Usuario ({sessions.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-lg">Cargando...</div>
              </div>
            ) : activeTab === "therapists" ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Terapeutas Registrados
                </h2>
                {therapists.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay terapeutas registrados
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ubicación
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Experiencia
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {therapists.map((therapist) => (
                          <tr key={therapist.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {therapist.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {therapist.specialties.slice(0, 2).join(", ")}
                                {therapist.specialties.length > 2 && "..."}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {therapist.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {therapist.city}, {therapist.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              €{therapist.session_price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {therapist.years_experience} años
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                onClick={() => deleteTherapist(therapist.id)}
                                variant="destructive"
                                size="sm"
                              >
                                Eliminar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Sesiones de Usuario
                </h2>
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay sesiones registradas
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resultados
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Selecciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sessions.map((session) => (
                          <tr key={session.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {session.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(session.created_at).toLocaleDateString(
                                "es-ES"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {session.model_results_count} modelos
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {session.user_selections_count} selecciones
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
