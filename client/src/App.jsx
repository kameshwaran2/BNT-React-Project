import "./App.css";
import Front from "./Front";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Chatbot from "./sri/OnlineTestHelper";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Instructions from "./sri/Instructions";
import AssessmentPage from "./sri/AssessmentPage";
import AssesmentPage2 from "./sri/AssesmentPage2";
import AssesmentPage3 from "./sri/AssesmentPage3";
import AssesmentPage4 from "./sri/AssesmentPage4";
import ResultPage from "./sri/ResultPage";
import OverallResultPage from "./sri/OverallResultPage";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Front />} />
        <Route
          path="/hi"
          element={
            <Instructions darkMode={darkMode} setDarkMode={setDarkMode} />
          }
        />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment2" element={<AssesmentPage2 />} />
        <Route path="/assessment3" element={<AssesmentPage3 />} />
        <Route path="/assessment4" element={<AssesmentPage4 />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/overall-result" element={<OverallResultPage />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
