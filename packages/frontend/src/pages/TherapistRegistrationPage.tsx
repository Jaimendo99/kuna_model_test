import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface TherapistFormData {
  name: string;
  professional_titles: string;
  professional_id_number: string;
  email: string;
  specialties: string[];
  therapeutic_approaches: string[];
  session_price: number;
  country: string;
  city: string;
  remote: boolean;
  on_site: boolean;
  hybrid: boolean;
  bio: string;
  years_experience: number;
  languages: string[];
  therapeutic_style: string[];
  age_groups: string[];
  weekly_availability: string;
  commitment_level: string;
  additional_info: string;
}

const SPECIALTIES_OPTIONS = [
  "Ansiedad y estrés",
  "Depresión",
  "Relaciones / vínculos",
  "Duelo y pérdidas",
  "Trauma / TEPT",
  "Autoestima",
  "Adolescencia",
  "Sexualidad",
  "Trastornos alimenticios",
];

const APPROACHES_OPTIONS = [
  "Terapia Cognitivo-Conductual (CBT)",
  "Humanista / centrada en la persona",
  "Psicoanálisis / psicodinámica",
  "Sistémica",
  "EMDR",
  "Mindfulness / aceptación",
  "Espiritual / transpersonal",
];

const LANGUAGES_OPTIONS = ["Español", "Inglés"];

const THERAPEUTIC_STYLE_OPTIONS = [
  "Contenedor y empático 🫂",
  "Directo y confrontativo ⚡",
  "Espiritual y profundo 🌱",
  "Analítico y reflexivo 🧠",
  "Práctico y orientado a soluciones 🛠️",
  "Flexible y adaptativo 🌀",
];

const AGE_GROUPS_OPTIONS = [
  "Adolescentes (13–17)",
  "Jóvenes (18–25)",
  "Adultos (26–50)",
  "Adultos mayores (50+)",
  "Todos los anteriores",
];

const COMMITMENT_LEVELS = [
  "Sesiones ocasionales / baja disponibilidad",
  "Sesiones constantes (2–5 pacientes fijos)",
  "Alta disponibilidad / puedo recibir varios pacientes nuevos por semana",
];

const TherapistRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [customApproach, setCustomApproach] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");
  const [customStyle, setCustomStyle] = useState("");
  const [formData, setFormData] = useState<TherapistFormData>({
    name: "",
    professional_titles: "",
    professional_id_number: "",
    email: "",
    specialties: [],
    therapeutic_approaches: [],
    session_price: 0,
    country: "",
    city: "",
    remote: false,
    on_site: false,
    hybrid: false,
    bio: "",
    years_experience: 0,
    languages: [],
    therapeutic_style: [],
    age_groups: [],
    weekly_availability: "",
    commitment_level: "",
    additional_info: "",
  });

  const handleInputChange = (field: keyof TherapistFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayFieldChange = (
    field:
      | "specialties"
      | "therapeutic_approaches"
      | "languages"
      | "therapeutic_style"
      | "age_groups",
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const addCustomOption = (
    field:
      | "specialties"
      | "therapeutic_approaches"
      | "languages"
      | "therapeutic_style",
    customValue: string,
    setter: (value: string) => void
  ) => {
    if (customValue.trim() && !formData[field].includes(customValue.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], customValue.trim()],
      }));
      setter("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      formData.specialties.length === 0 ||
      formData.therapeutic_style.length > 2
    ) {
      alert(
        "Por favor completa los campos obligatorios y selecciona máximo 2 estilos terapéuticos"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await api.registerTherapist(formData);
      alert(
        "¡Registro exitoso! Tu perfil ha sido añadido a nuestra base de datos."
      );
      navigate("/");
    } catch (error) {
      console.error("Error registering therapist:", error);
      alert("Error al registrar. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="text-center px-6 py-8 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900">
              Registro de Psicólogos - Kuna
            </h1>
            <p className="text-lg mt-4 text-gray-600">
              Únete a nuestra plataforma y ayuda a conectar con personas que
              necesitan tu apoyo profesional
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Información Personal */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  1. Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Nombre completo y títulos profesionales *
                    </label>
                    <input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Dr./Dra./Lic./Mtro./Mtra. [Tu nombre completo]"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="professional_id_number"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Número de cédula profesional / registro local
                    </label>
                    <input
                      id="professional_id_number"
                      value={formData.professional_id_number}
                      onChange={(e) =>
                        handleInputChange(
                          "professional_id_number",
                          e.target.value
                        )
                      }
                      placeholder="Número de cédula o registro profesional"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Correo Electrónico *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="tu.correo@ejemplo.com"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* 3. Modalidades de atención */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  3. Modalidades de atención que ofreces
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      id="remote"
                      type="checkbox"
                      checked={formData.remote}
                      onChange={(e) =>
                        handleInputChange("remote", e.target.checked)
                      }
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor="remote" className="text-sm text-gray-700">
                      Online
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      id="on_site"
                      type="checkbox"
                      checked={formData.on_site}
                      onChange={(e) =>
                        handleInputChange("on_site", e.target.checked)
                      }
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor="on_site" className="text-sm text-gray-700">
                      Presencial
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      id="hybrid"
                      type="checkbox"
                      checked={formData.hybrid}
                      onChange={(e) =>
                        handleInputChange("hybrid", e.target.checked)
                      }
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor="hybrid" className="text-sm text-gray-700">
                      Híbrido (ambos)
                    </label>
                  </div>
                </div>
              </div>

              {/* 4. Ubicación */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  4. Ubicación (si das atención presencial)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      País
                    </label>
                    <input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="México, Colombia, Argentina, etc."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Ciudad
                    </label>
                    <input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Ciudad de México, Bogotá, Buenos Aires, etc."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Idiomas */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  5. Idiomas en los que puedes brindar terapia
                </h3>
                <div className="space-y-3">
                  {LANGUAGES_OPTIONS.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <input
                        id={`language-${language}`}
                        type="checkbox"
                        checked={formData.languages.includes(language)}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "languages",
                            language,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`language-${language}`}
                        className="text-sm text-gray-700"
                      >
                        {language}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Otro idioma..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addCustomOption(
                          "languages",
                          customLanguage,
                          setCustomLanguage
                        )
                      }
                      className="px-3 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. Especialidades clínicas */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  6. ¿Cuáles son tus especialidades clínicas? *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SPECIALTIES_OPTIONS.map((specialty) => (
                    <div
                      key={specialty}
                      className="flex items-center space-x-2"
                    >
                      <input
                        id={`specialty-${specialty}`}
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "specialties",
                            specialty,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`specialty-${specialty}`}
                        className="text-sm text-gray-700"
                      >
                        {specialty}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <input
                      type="text"
                      value={customSpecialty}
                      onChange={(e) => setCustomSpecialty(e.target.value)}
                      placeholder="Otros especialidades..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addCustomOption(
                          "specialties",
                          customSpecialty,
                          setCustomSpecialty
                        )
                      }
                      className="px-3 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>

              {/* 7. Enfoques terapéuticos */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  7. Enfoques terapéuticos que utilizas regularmente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {APPROACHES_OPTIONS.map((approach) => (
                    <div key={approach} className="flex items-center space-x-2">
                      <input
                        id={`approach-${approach}`}
                        type="checkbox"
                        checked={formData.therapeutic_approaches.includes(
                          approach
                        )}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "therapeutic_approaches",
                            approach,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`approach-${approach}`}
                        className="text-sm text-gray-700"
                      >
                        {approach}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <input
                      type="text"
                      value={customApproach}
                      onChange={(e) => setCustomApproach(e.target.value)}
                      placeholder="Otro enfoque..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addCustomOption(
                          "therapeutic_approaches",
                          customApproach,
                          setCustomApproach
                        )
                      }
                      className="px-3 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>

              {/* 8. Estilo terapéutico */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  8. ¿Cómo describirías tu estilo o tono terapéutico? (Máximo 2)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {THERAPEUTIC_STYLE_OPTIONS.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <input
                        id={`style-${style}`}
                        type="checkbox"
                        checked={formData.therapeutic_style.includes(style)}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "therapeutic_style",
                            style,
                            e.target.checked
                          )
                        }
                        disabled={
                          !formData.therapeutic_style.includes(style) &&
                          formData.therapeutic_style.length >= 2
                        }
                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 disabled:opacity-50"
                      />
                      <label
                        htmlFor={`style-${style}`}
                        className={`text-sm ${
                          formData.therapeutic_style.includes(style) ||
                          formData.therapeutic_style.length < 2
                            ? "text-gray-700"
                            : "text-gray-400"
                        }`}
                      >
                        {style}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <input
                      type="text"
                      value={customStyle}
                      onChange={(e) => setCustomStyle(e.target.value)}
                      placeholder="Otro estilo..."
                      disabled={formData.therapeutic_style.length >= 2}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addCustomOption(
                          "therapeutic_style",
                          customStyle,
                          setCustomStyle
                        )
                      }
                      disabled={formData.therapeutic_style.length >= 2}
                      className="px-3 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Seleccionados: {formData.therapeutic_style.length}/2
                </p>
              </div>

              {/* 9. Rangos de edad */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  9. ¿A qué rangos de edad prefieres atender?
                </h3>
                <div className="space-y-3">
                  {AGE_GROUPS_OPTIONS.map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <input
                        id={`age-${group}`}
                        type="checkbox"
                        checked={formData.age_groups.includes(group)}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "age_groups",
                            group,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`age-${group}`}
                        className="text-sm text-gray-700"
                      >
                        {group}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10. Disponibilidad semanal */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  10. ¿Cuál es tu disponibilidad semanal promedio?
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Días y horarios aproximados:
                  </label>
                  <textarea
                    value={formData.weekly_availability}
                    onChange={(e) =>
                      handleInputChange("weekly_availability", e.target.value)
                    }
                    placeholder="Ej: Lunes a viernes de 9:00 AM a 6:00 PM, Sábados de 10:00 AM a 2:00 PM"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              {/* 11. Nivel de compromiso */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  11. ¿Qué nivel de compromiso estás dispuesto/a asumir con
                  Kuna?
                </h3>
                <div className="space-y-3">
                  {COMMITMENT_LEVELS.map((level) => (
                    <div key={level} className="flex items-center space-x-3">
                      <input
                        id={`commitment-${level}`}
                        name="commitment_level"
                        type="radio"
                        value={level}
                        checked={formData.commitment_level === level}
                        onChange={(e) =>
                          handleInputChange("commitment_level", e.target.value)
                        }
                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`commitment-${level}`}
                        className="text-sm text-gray-700"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Información Profesional Adicional
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="years_experience"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Años de Experiencia
                    </label>
                    <input
                      id="years_experience"
                      type="number"
                      value={formData.years_experience}
                      onChange={(e) =>
                        handleInputChange(
                          "years_experience",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="5"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="session_price"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Precio por Sesión (USD)
                    </label>
                    <input
                      id="session_price"
                      type="number"
                      value={formData.session_price}
                      onChange={(e) =>
                        handleInputChange(
                          "session_price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="60"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Biografía Profesional
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Describe tu experiencia, formación y enfoque terapéutico..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              {/* 12. Campo libre */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  12. ¿Hay algo más que quieras compartir sobre tu estilo,
                  visión o límites personales? (Opcional)
                </h3>
                <div className="space-y-2">
                  <textarea
                    value={formData.additional_info}
                    onChange={(e) =>
                      handleInputChange("additional_info", e.target.value)
                    }
                    placeholder="Comparte cualquier información adicional que consideres relevante sobre tu práctica terapéutica..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <h3 className="font-semibold text-teal-900 mb-2">
                  Información importante:
                </h3>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>
                    • Tu perfil será revisado antes de ser activado en la
                    plataforma
                  </li>
                  <li>• Solo psicólogos colegiados pueden registrarse</li>
                  <li>
                    • Los datos proporcionados deben ser veraces y actualizados
                  </li>
                  <li>
                    • Recibirás un correo de confirmación tras el registro
                  </li>
                </ul>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-coral text-white rounded-xl hover:bg-coral/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistRegistrationPage;
