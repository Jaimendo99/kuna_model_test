import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { api } from "@/lib/api";
import { TherapistMatch } from "@/lib/types";

const TherapistCard: React.FC<{
  therapist: TherapistMatch;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ therapist, onSelect, isSelected }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border transition-all cursor-pointer ${
      isSelected
        ? "ring-2 ring-teal-500 bg-teal-50 border-teal-300"
        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
    }`}
    onClick={onSelect}
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {therapist.name}
        </h3>
        {/* <div className="text-right">
          <div className="text-sm text-gray-500">{modelName}</div>
          <div className="text-sm font-medium text-teal-600">
            Confianza:{" "}
            {therapist.confidence_score || therapist.match_score || "N/A"}%
          </div>
        </div> */}
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div>
          <span className="font-medium text-gray-900">Ubicación:</span>{" "}
          {therapist.city}, {therapist.country}
        </div>
        <div>
          <span className="font-medium text-gray-900">Precio:</span> $
          {therapist.session_price}/sesión
        </div>
        <div>
          <span className="font-medium text-gray-900">Especialidades:</span>{" "}
          {therapist.specialties.join(", ")}
        </div>
        <div>
          <span className="font-medium text-gray-900">Enfoques:</span>{" "}
          {therapist.therapeutic_approaches.join(", ")}
        </div>
        {therapist.match_reason && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-900">
              Por qué esta compatibilidad:
            </span>
            <p className="mt-1 text-gray-700">{therapist.match_reason}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ResultsPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { results, setResults, userEmail } = useAppStore();
  const [selectedTherapist, setSelectedTherapist] = useState<{
    therapistId: string;
    modelName: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId || !userEmail) {
      navigate("/");
      return;
    }

    const fetchResults = async () => {
      try {
        const fetchedResults = await api.getResults(sessionId);
        setResults(fetchedResults);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId, userEmail, navigate, setResults]);

  const handleSubmitSelection = async () => {
    if (!selectedTherapist || !sessionId) return;

    setIsSubmitting(true);
    try {
      await api.selectTherapist({
        session_id: sessionId,
        selected_therapist_id: selectedTherapist.therapistId,
        feedback: `Seleccionado de ${selectedTherapist.modelName}`,
      });
      navigate("/thank-you");
    } catch (error) {
      console.error("Failed to submit selection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Procesando tus compatibilidades...
          </h2>
          <p className="text-gray-600">
            Esto puede tomar un momento mientras analizamos tus preferencias.
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            No se encontraron resultados
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white rounded-xl font-medium transition-all"
          >
            Comenzar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tus Recomendaciones de Terapeutas
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            A continuación tienes recomendaciones de tres modelos diferentes.
            Selecciona el terapeuta que te parezca la mejor opción.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {results.results.map((result, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-semibold text-center mb-4">
                {result.display_name}
              </h2>
              {/* Wrap the two conditional renderings in a Fragment */}
              <>
                {result.matches
                  .sort((a, b) => {
                    // Sort by confidence_score first, then match_score, both descending
                    const aScore = a.confidence_score || a.match_score || 0;
                    const bScore = b.confidence_score || b.match_score || 0;
                    return bScore - aScore;
                  })
                  .slice(0, 5)
                  .map((therapist) => (
                    <TherapistCard
                      key={therapist.id}
                      therapist={therapist}
                      isSelected={
                        selectedTherapist?.therapistId === therapist.id
                      }
                      onSelect={() =>
                        setSelectedTherapist({
                          therapistId: therapist.id,
                          modelName: result.display_name,
                        })
                      }
                    />
                  ))}
                {result.matches.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">
                      No se encontraron compatibilidades para este modelo
                    </p>
                  </div>
                )}
              </>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmitSelection}
            disabled={!selectedTherapist || isSubmitting}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              !selectedTherapist || isSubmitting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-coral-500 hover:bg-coral-600 text-white shadow-sm"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Mi Elección"}
          </button>
          {selectedTherapist && (
            <p className="mt-4 text-sm text-gray-600">
              Seleccionaste: <strong>{selectedTherapist.modelName}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
