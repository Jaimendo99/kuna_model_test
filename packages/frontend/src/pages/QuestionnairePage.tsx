import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { api } from "@/lib/api";

const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    userEmail,
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswer,
    setIsLoading,
    setSessionId,
  } = useAppStore();

  const [currentAnswer, setCurrentAnswer] = useState<any>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      navigate("/");
      return;
    }

    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await api.getQuestions();
        setQuestions(
          fetchedQuestions.sort((a, b) => a.display_order - b.display_order)
        );
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, [userEmail, navigate, setQuestions]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const questionId = questions[currentQuestionIndex].id;
      setCurrentAnswer(answers[questionId] || "");
    }
  }, [currentQuestionIndex, questions, answers]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (currentQuestion && currentAnswer) {
      // For multiple choice, ensure at least one option is selected
      if (currentQuestion.question_type === "multiple_choice") {
        if (!Array.isArray(currentAnswer) || currentAnswer.length === 0) {
          return; // Don't proceed if no options selected
        }
      }

      setAnswer(currentQuestion.id, currentAnswer);

      if (isLastQuestion) {
        handleSubmit();
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer("");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Check if current answer is valid
  const isAnswerValid = () => {
    if (!currentAnswer) return false;
    if (currentQuestion?.question_type === "multiple_choice") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!currentQuestion || !currentAnswer) return;

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Save the last answer
      const finalAnswers = { ...answers, [currentQuestion.id]: currentAnswer };

      // Submit questionnaire
      const response = await api.submitQuestionnaire(userEmail, finalAnswers);
      setSessionId(response.session_id);

      // Navigate to results
      navigate(`/results/${response.session_id}`);
    } catch (error) {
      console.error("Failed to submit questionnaire:", error);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.question_type) {
      case "multiple_choice":
        // For multiple choice, allow multiple selections
        const selectedOptions = Array.isArray(currentAnswer)
          ? currentAnswer
          : [];

        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <label
                  key={index}
                  className={`block w-full p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-teal-50 border-teal-400 text-teal-800"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCurrentAnswer([...selectedOptions, option]);
                        } else {
                          setCurrentAnswer(
                            selectedOptions.filter((o) => o !== option)
                          );
                        }
                      }}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>
        );

      case "single_choice":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = currentAnswer === option;
              return (
                <label
                  key={index}
                  className={`block w-full p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-teal-50 border-teal-400 text-teal-800"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => setCurrentAnswer(option)}
                      className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>
        );

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>1 (Para nada)</span>
              <span>10 (Extremadamente)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={currentAnswer || 5}
              onChange={(e) => setCurrentAnswer(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-teal"
            />
            <div className="text-center text-lg font-medium text-teal-600">
              {currentAnswer || 5}
            </div>
          </div>
        );

      case "text_input":
        return (
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            rows={4}
          />
        );

      case "yes_no":
        return (
          <div className="space-y-3">
            {["yes", "no"].map((value, index) => {
              const isSelected = currentAnswer === value;
              const displayText = value === "yes" ? "Sí" : "No";
              return (
                <label
                  key={index}
                  className={`block w-full p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-teal-50 border-teal-400 text-teal-800"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => setCurrentAnswer(value)}
                      className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium">{displayText}</span>
                  </div>
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Cargando preguntas...</h2>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No hay más preguntas</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span>{Math.round(progress)}% Completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question_text}
          </h2>
          <div className="space-y-6">{renderQuestionInput()}</div>
        </div>

        {/* Blue Hint Section */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 text-sm font-medium">i</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-teal-800">
                Vamos paso a paso en el proceso de encontrar el mejor terapeuta
                para ti. Comenzaremos con algunas preguntas básicas.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentQuestionIndex === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswerValid() || isSubmitting}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex-1 max-w-xs ${
              !isAnswerValid() || isSubmitting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-coral-500 hover:bg-coral-600 text-white shadow-sm"
            }`}
          >
            {isSubmitting
              ? "Enviando..."
              : isLastQuestion
              ? "Enviar y Ver Resultados"
              : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;
