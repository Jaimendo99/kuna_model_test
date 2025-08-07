import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const { reset } = useAppStore();

  const handleStartOver = () => {
    reset();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-700 mb-4">
            ¡Gracias!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-6xl mb-6">🎉</div>

          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Tu participación nos ayuda a mejorar la búsqueda de terapeutas con
              IA para todos.
            </p>

            <p className="text-gray-600">
              Tus respuestas y selección han sido registradas y contribuirán a
              hacer que nuestros modelos sean mejores para entender lo que las
              personas buscan en terapia.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">¿Qué sigue?</h3>
            <p className="text-sm text-green-800">
              Nuestro equipo de investigación analizará los resultados para
              mejorar nuestros algoritmos de compatibilidad. Tus datos
              permanecerán anónimos y se usarán únicamente para propósitos de
              investigación.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button onClick={handleStartOver} variant="outline">
            Realizar Encuesta Otra Vez
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThankYouPage;
