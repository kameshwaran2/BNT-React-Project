import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Chatbot from "./OnlineTestHelper";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Instructions from "./Instructions";
import AssessmentPage from "./AssessmentPage";
import AssesmentPage2 from "./AssesmentPage2";
import AssesmentPage3 from "./AssesmentPage3";
import AssesmentPage4 from "./AssesmentPage4";
import ResultPage from "./ResultPage";
import OverallResultPage from "./OverallResultPage";

function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
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
      </div>
    </>
  );
}

export default Home;
