import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  available: boolean;
  timeSlots: TimeSlot[];
}

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
  bio: string;
  years_experience: number;
  languages: string[];
  therapeutic_style: string[];
  age_groups: string[];
  weekly_availability: string;
  schedule: DaySchedule[];
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

const DAYS_OF_WEEK = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const COMMON_TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

const createDefaultSchedule = (): DaySchedule[] => {
  return DAYS_OF_WEEK.map((day) => ({
    day,
    available: false,
    timeSlots: [],
  }));
};

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
    bio: "",
    years_experience: 0,
    languages: [],
    therapeutic_style: [],
    age_groups: [],
    weekly_availability: "",
    schedule: createDefaultSchedule(),
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

  // Schedule management functions
  const handleDayToggle = (dayIndex: number, available: boolean) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule, index) =>
        index === dayIndex
          ? {
              ...daySchedule,
              available,
              timeSlots: available ? daySchedule.timeSlots : [],
            }
          : daySchedule
      ),
    }));
  };

  const setQuickSchedule = (type: "business" | "flexible" | "weekend") => {
    let newSchedule = createDefaultSchedule();

    switch (type) {
      case "business":
        // Monday to Friday, 9-17
        newSchedule = newSchedule.map((day, index) => {
          if (index < 5) {
            // Monday to Friday
            return {
              ...day,
              available: true,
              timeSlots: [{ start: "09:00", end: "17:00" }],
            };
          }
          return day;
        });
        break;
      case "flexible":
        // Monday to Friday, 10-19 with lunch break
        newSchedule = newSchedule.map((day, index) => {
          if (index < 5) {
            // Monday to Friday
            return {
              ...day,
              available: true,
              timeSlots: [
                { start: "10:00", end: "13:00" },
                { start: "14:00", end: "19:00" },
              ],
            };
          }
          return day;
        });
        break;
      case "weekend":
        // Saturday and Sunday, 10-16
        newSchedule = newSchedule.map((day, index) => {
          if (index === 5 || index === 6) {
            // Saturday and Sunday
            return {
              ...day,
              available: true,
              timeSlots: [{ start: "10:00", end: "16:00" }],
            };
          }
          return day;
        });
        break;
    }

    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const addTimeSlot = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule, index) =>
        index === dayIndex
          ? {
              ...daySchedule,
              timeSlots: [
                ...daySchedule.timeSlots,
                { start: "09:00", end: "17:00" },
              ],
            }
          : daySchedule
      ),
    }));
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule, index) =>
        index === dayIndex
          ? {
              ...daySchedule,
              timeSlots: daySchedule.timeSlots.map((slot, sIndex) => {
                if (sIndex === slotIndex) {
                  const updatedSlot = { ...slot, [field]: value };
                  // Validate that end time is after start time
                  if (field === "start" && updatedSlot.end <= value) {
                    const startIndex = COMMON_TIME_SLOTS.indexOf(value);
                    const nextTimeIndex = Math.min(
                      startIndex + 1,
                      COMMON_TIME_SLOTS.length - 1
                    );
                    updatedSlot.end = COMMON_TIME_SLOTS[nextTimeIndex];
                  } else if (field === "end" && updatedSlot.start >= value) {
                    const endIndex = COMMON_TIME_SLOTS.indexOf(value);
                    const prevTimeIndex = Math.max(endIndex - 1, 0);
                    updatedSlot.start = COMMON_TIME_SLOTS[prevTimeIndex];
                  }
                  return updatedSlot;
                }
                return slot;
              }),
            }
          : daySchedule
      ),
    }));
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule, index) =>
        index === dayIndex
          ? {
              ...daySchedule,
              timeSlots: daySchedule.timeSlots.filter(
                (_, sIndex) => sIndex !== slotIndex
              ),
            }
          : daySchedule
      ),
    }));
  };

  // Convert schedule to readable string for backend compatibility
  const scheduleToString = (schedule: DaySchedule[]): string => {
    const availableDays = schedule.filter(
      (day) => day.available && day.timeSlots.length > 0
    );
    if (availableDays.length === 0) return "";

    return availableDays
      .map((day) => {
        const slots = day.timeSlots
          .map((slot) => `${slot.start}-${slot.end}`)
          .join(", ");
        return `${day.day}: ${slots}`;
      })
      .join("; ");
  };

  // Schedule Picker Component
  const SchedulePicker: React.FC = () => {
    const schedulePreview = scheduleToString(formData.schedule);

    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          📅 <strong>Instrucciones:</strong> Selecciona los días que estarás
          disponible y agrega los horarios específicos para cada día. Puedes
          agregar múltiples bloques de horarios por día.
        </div>

        {/* Quick Schedule Presets */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            ⚡ Plantillas rápidas:
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQuickSchedule("business")}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors"
            >
              Horario comercial (L-V 9-17)
            </button>
            <button
              type="button"
              onClick={() => setQuickSchedule("flexible")}
              className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors"
            >
              Horario flexible (L-V 10-13, 14-19)
            </button>
            <button
              type="button"
              onClick={() => setQuickSchedule("weekend")}
              className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md hover:bg-purple-200 transition-colors"
            >
              Solo fines de semana (S-D 10-16)
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Estas plantillas se pueden personalizar después
          </p>
        </div>

        <div className="space-y-3">
          {formData.schedule.map((daySchedule, dayIndex) => (
            <div
              key={daySchedule.day}
              className={`border rounded-lg p-4 space-y-3 transition-all duration-200 ${
                daySchedule.available
                  ? "border-teal-200 bg-teal-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`day-${dayIndex}`}
                    checked={daySchedule.available}
                    onChange={(e) =>
                      handleDayToggle(dayIndex, e.target.checked)
                    }
                    className="w-5 h-5 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`day-${dayIndex}`}
                    className={`text-base font-medium cursor-pointer ${
                      daySchedule.available ? "text-teal-900" : "text-gray-500"
                    }`}
                  >
                    {daySchedule.day}
                  </label>
                  {daySchedule.available &&
                    daySchedule.timeSlots.length > 0 && (
                      <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded-full">
                        {daySchedule.timeSlots.length} horario
                        {daySchedule.timeSlots.length !== 1 ? "s" : ""}
                      </span>
                    )}
                </div>
                {daySchedule.available && (
                  <button
                    type="button"
                    onClick={() => addTimeSlot(dayIndex)}
                    className="text-sm bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 transition-colors shadow-sm"
                  >
                    + Agregar horario
                  </button>
                )}
              </div>

              {daySchedule.available && (
                <div className="space-y-2 ml-8">
                  {daySchedule.timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="flex items-center space-x-3 bg-white p-2 rounded border border-teal-200"
                    >
                      <span className="text-sm text-gray-600 min-w-[30px]">
                        De
                      </span>
                      <select
                        value={slot.start}
                        onChange={(e) =>
                          updateTimeSlot(
                            dayIndex,
                            slotIndex,
                            "start",
                            e.target.value
                          )
                        }
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        {COMMON_TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500 text-sm">a</span>
                      <select
                        value={slot.end}
                        onChange={(e) =>
                          updateTimeSlot(
                            dayIndex,
                            slotIndex,
                            "end",
                            e.target.value
                          )
                        }
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        {COMMON_TIME_SLOTS.filter(
                          (time) => time > slot.start
                        ).map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 text-sm px-2 py-1.5 rounded transition-colors"
                        title="Eliminar horario"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  {daySchedule.timeSlots.length === 0 && (
                    <div className="text-sm text-gray-500 italic p-2 bg-gray-100 rounded border border-gray-200">
                      Haz clic en "Agregar horario" para especificar las horas
                      disponibles
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Schedule Preview */}
        {schedulePreview && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              📋 Vista previa de tu horario:
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {schedulePreview}
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one day is available with time slots
    const hasAvailableSchedule = formData.schedule.some(
      (day) => day.available && day.timeSlots.length > 0
    );

    // Required text/number fields
    if (
      !formData.name ||
      !formData.professional_id_number ||
      !formData.email ||
      !formData.country ||
      !formData.city ||
      !hasAvailableSchedule ||
      !formData.commitment_level ||
      !formData.session_price ||
      !formData.years_experience ||
      !formData.bio
    ) {
      if (!hasAvailableSchedule) {
        alert(
          "Por favor especifica tu disponibilidad horaria para al menos un día de la semana."
        );
      } else {
        alert("Por favor completa todos los campos obligatorios.");
      }
      return;
    }

    // Required checkbox groups
    if (formData.specialties.length === 0) {
      alert("Selecciona al menos una especialidad.");
      return;
    }
    if (formData.languages.length === 0) {
      alert("Selecciona al menos un idioma.");
      return;
    }
    if (formData.therapeutic_approaches.length === 0) {
      alert("Selecciona al menos un enfoque terapéutico.");
      return;
    }
    if (formData.therapeutic_style.length === 0) {
      alert("Selecciona al menos un estilo terapéutico.");
      return;
    }
    if (formData.age_groups.length === 0) {
      alert("Selecciona al menos un rango de edad.");
      return;
    }

    // Validate at least one modality is selected
    if (!formData.remote && !formData.on_site) {
      alert("Selecciona al menos una modalidad de atención.");
      return;
    }

    // Max 2 styles
    if (formData.therapeutic_style.length > 2) {
      alert("Selecciona máximo 2 estilos terapéuticos.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert schedule to string format for backend compatibility
      const scheduleString = scheduleToString(formData.schedule);
      const submissionData = {
        ...formData,
        weekly_availability: scheduleString,
      };

      await api.registerTherapist(submissionData);
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
                      Código ACCES / Registro Profesional Local *
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
                      placeholder="Código ACCES / registro profesional local"
                      required
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
                  3. Modalidades de atención que ofreces *
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
                </div>
              </div>

              {/* 4. Ubicación */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  4. Ubicación (si das atención presencial) *
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
                      required
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
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Idiomas */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  5. Idiomas en los que puedes brindar terapia *
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
                  7. Enfoques terapéuticos que utilizas regularmente *
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
                  *
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
                  9. ¿A qué rangos de edad prefieres atender? *
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
                  10. ¿Cuál es tu disponibilidad semanal? *
                </h3>
                <SchedulePicker />
              </div>

              {/* 11. Nivel de compromiso */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  11. ¿Qué nivel de compromiso estás dispuesto/a asumir con
                  Kuna? *
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
                      Años de Experiencia *
                    </label>
                    <input
                      id="years_experience"
                      type="number"
                      value={formData.years_experience || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          handleInputChange(
                            "years_experience",
                            value === "" ? 0 : parseInt(value)
                          );
                        }
                      }}
                      onKeyPress={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Ej: 5"
                      min="0"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="session_price"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      Precio por Sesión (USD) *
                    </label>
                    <input
                      id="session_price"
                      type="number"
                      value={formData.session_price || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
                          handleInputChange(
                            "session_price",
                            value === "" ? 0 : parseFloat(value)
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Ej: 60"
                      min="0"
                      step="1"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Biografía Profesional *
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Describe tu experiencia, formación y enfoque terapéutico..."
                    rows={4}
                    required
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
