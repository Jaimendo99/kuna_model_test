import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";

const WelcomePage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const navigate = useNavigate();
  const { setUserEmail } = useAppStore();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const handleStart = () => {
    if (isValidEmail) {
      setUserEmail(email);
      navigate("/questionnaire");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="text-center p-6 pb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Estudio de Compatibilidad con Terapeutas
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Ayúdanos a comparar diferentes modelos de IA para encontrar
            terapeutas respondiendo algunas preguntas. Te mostraremos
            recomendaciones de diferentes modelos y podrás decirnos cuál
            funciona mejor.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 pt-0 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu.correo@ejemplo.com"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            />
            <p className="text-xs text-gray-500">
              Usaremos esto para guardar tus respuestas y mostrarte los
              resultados.
            </p>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <h3 className="font-semibold text-teal-900 mb-2">Qué esperar:</h3>
            <ul className="text-sm text-teal-800 space-y-1">
              <li>• Responder preguntas sobre tus preferencias de terapia</li>
              <li>
                • Revisar recomendaciones de terapeutas de diferentes modelos de
                IA
              </li>
              <li>• Seleccionar la recomendación que te parezca mejor</li>
              <li>• Ayúdanos a mejorar la búsqueda de terapeutas con IA</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col space-y-4">
          <button
            onClick={handleStart}
            disabled={!isValidEmail}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
              !isValidEmail
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-coral-500 hover:bg-coral-600 text-white shadow-sm"
            }`}
          >
            Comenzar Cuestionario
          </button>

          <div className="justify-between w-full text-center space-x-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">¿Eres psicólogo?</p>
              <button
                onClick={() => navigate("/register-therapist")}
                className="px-3 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all"
              >
                Registrarte en nuestra plataforma
              </button>
            </div>

            {/* <div>
              <p className="text-sm text-gray-500 mb-2">¿Eres administrador?</p>
              <button
                onClick={() => navigate("/admin")}
                className="px-3 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all"
              >
                Panel de Administración
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
