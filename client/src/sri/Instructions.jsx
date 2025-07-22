import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa'; // Theme icons


function Instructions({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const toggleMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  const handleStartClick = () => {
    navigate('/assessment'); // This takes user to Assessment page
  };

  const tests = [
    {
      title: "Quantitative Aptitude",
      route: "/assessment",
      color: "primary",
      points: [
        "This test consists of 10 questions.",
        "You will have 20 minutes to complete the test.",
        "The test will be auto-submitted when the time runs out.",
        "Read each question carefully before answering.",
        "All questions are compulsory unless specified otherwise.",
        "Use rough paper for calculations if needed.",
        "Do not use calculators or any electronic devices.",
        "Manage your time efficiently.",
        "Check your answers before submitting."
      ]
    },
    {
      title: "Verbal Aptitude",
      route: "/assessment2",
      color: "warning",
      points: [
        "The test has a fixed number of questions and a strict time limit.",
        "All questions are multiple choice: Grammar, Vocabulary, Sentence Correction, and Comprehension.",
        "Each correct answer carries 1 mark. No negative marking unless specified.",
        "You cannot return to a previous question.",
        "Do not switch tabs or refresh the page.",
        "After submission, your score, answers, and time will be shown."
      ]
    },
    {
      title: "Logical Reasoning",
      route: "/assessment3",
      color: "success",
      points: [
        "Contains puzzles, patterns, and critical thinking questions.",
        "Use logic and deduction to solve problems.",
        "Questions are multiple choice with four options.",
        "Each correct answer gives 1 mark; no negative marking unless mentioned.",
        "Avoid spending too much time on one question.",
        "Do not refresh or switch tabs during the test.",
        "Answers once submitted are final."
      ]
    },
    {
      title: "Data Sufficiency",
      route: "/assessment4",
      color: "danger",
      points: [
        "Logical and reasoning-based questions.",
        "Each question asks if data is sufficient to answer.",
        "Options: (A) Statement 1 alone, (B) Statement 2 alone, (C) Both, (D) Neither.",
        "You cannot return to answered questions.",
        "Do not switch tabs or refresh the page.",
        "After submission, your score and time will be shown."
      ]
    }
  ];
  


  return (
    <>
      {/* Navbar with theme toggle */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Aptitude Test</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item me-3">
                <button
                  className="btn btn-outline-light"
                  onClick={toggleMode}
                  title="Toggle Theme"
                >
                  {darkMode ? <FaSun /> : <FaMoon />}
                </button>
              </li>
              <li className="nav-item"><a className="nav-link" href="#instructions">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#categories">Test Categories</a></li>
              <li className="nav-item"><a className="nav-link" href="#score">Score & Result</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Heading */}
      <div className="container" style={{ paddingTop: "100px" }} id="instructions">
  <div className="text-center mb-4">
    <h1>Welcome to the Online Aptitude Assessment</h1>
    <p style={{ color: darkMode ? '#ccc' : '#6c757d' }}>
      You can start from any category
    </p>
  </div>
</div>


      {/* Test Categories */}
      <div className="container pb-5" id="categories">
        <div className="row g-4">
          {tests.map((test, index) => (
            <div className="col-md-6" key={index}>
              <div className="card instruction-card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{test.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Instructions</h6>
                  <ul className="small ps-3">
                    {test.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                  <button  className="btn btn-primary mt-4" 
                   onClick={() => navigate(test.route)} // 👈 Dynamic route
                   >Start Test
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score & Result */}
      {/* Score Section */}
<div id="score" className="container text-center py-5">
  <div className={`p-4 rounded shadow-lg ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
    <h2 className="mb-3" style={{ color: darkMode ? '#00D1FF' : '#007BFF' }}>
      🏆 Score & 📊 Result Summary
    </h2>

    <p className="mb-3">
      View your Overall test score, performance breakdown, and insights into your strengths and weaknesses.
    </p>

    <ul className="list-unstyled mb-4">
      <li>✅ Overall score across all categories</li>
      <li>📈 Strengths and areas to improve</li>
    </ul>

    <button onClick={() => navigate("/overall-result")} className="btn btn-info">
  View Overall Result
</button>

  </div>
</div>



    </>
  );
}

export default Instructions;
