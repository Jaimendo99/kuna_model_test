import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import WelcomePage from "./pages/WelcomePage";
import QuestionnairePage from "./pages/QuestionnairePage";
import ResultsPage from "./pages/ResultsPage";
import ThankYouPage from "./pages/ThankYouPage";
import TherapistRegistrationPage from "./pages/TherapistRegistrationPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* <Route path="/" element={<WelcomePage />} /> */}
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route
            path="/register-therapist"
            element={<TherapistRegistrationPage />}
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
