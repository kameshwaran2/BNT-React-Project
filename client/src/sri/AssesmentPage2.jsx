import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function AssessmentPage2() {
  const API_URL = "http://localhost:3200/verbalQuestions";
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  const [trialQuestions, setTrialQuestions] = useState([]);
  const [realTestQuestions, setRealTestQuestions] = useState([]);
  const [isTrialMode, setIsTrialMode] = useState(true);

  const [showTrialFinishModal, setShowTrialFinishModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const [violationCount, setViolationCount] = useState(0);
  const [micViolation, setMicViolation] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  // ✅ Fetch questions initially (trial + real test sets)
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Raw fetched data:", data);

        const allQuestions = Array.isArray(data)
          ? data
          : data.quantQuestions || [];

        // ✅ Separate by difficulty
        const easyQ = allQuestions.filter((q) => q.difficulty === "easy");
        const mediumQ = allQuestions.filter((q) => q.difficulty === "medium");
        const hardQ = allQuestions.filter((q) => q.difficulty === "hard");

        const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

        // ✅ Pick 2 easy questions for trial
        const trialSet = shuffle(easyQ).slice(0, 2);

        // ✅ Pick 10 questions for real test: 3 easy + 4 medium + 3 hard
        const realTestSet = [
          ...shuffle(easyQ).slice(0, 3),
          ...shuffle(mediumQ).slice(0, 4),
          ...shuffle(hardQ).slice(0, 3),
        ];

        // ✅ FIXED: Properly map correct answer value for scoring
        const formatQuestions = (qs) =>
          qs.map((q) => {
            const shuffledOptions = Object.values(q.options).sort(
              () => Math.random() - 0.5
            );
            // ✅ Convert "C" → actual correct text e.g. "60"
            const correctAnswerValue = q.options[q.answer];
            return {
              ...q,
              options: shuffledOptions,
              answer: correctAnswerValue, // overwrite key with correct text
            };
          });

        // ✅ Save trial & real test separately
        setTrialQuestions(formatQuestions(trialSet));
        setRealTestQuestions(formatQuestions(realTestSet));

        // ✅ Start with trial
        setQuiz(formatQuestions(trialSet));
      })
      .catch((err) => console.error("❌ Error loading questions:", err));
  }, []);

  // ✅ Fullscreen + security lock
  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        console.warn("Fullscreen request failed");
      });
    }
  };

  useEffect(() => {
    enterFullscreen();

    const checkFullscreen = () => {
      if (!document.fullscreenElement && !isTrialMode) {
        addViolation("⚠️ Fullscreen exited! Stay in fullscreen mode.");
        enterFullscreen();
      }
    };

    const handleVisibility = () => {
      if (document.hidden && !isTrialMode) {
        addViolation("⚠️ Tab switch or minimize detected!");
      }
    };

    const blockKeys = (e) => {
      if (
        e.key === "Escape" ||
        e.key === "F11" ||
        (e.ctrlKey && e.key === "Tab") ||
        (e.altKey && e.key === "Tab")
      ) {
        e.preventDefault();
        if (!isTrialMode) addViolation("⚠️ Unauthorized key press detected!");
      }
    };

    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("keydown", blockKeys);
    };
  }, [isTrialMode]);

  // ✅ Timer (only for real test)
  useEffect(() => {
    if (isTrialMode) return;
    if (timeLeft <= 0) {
      handleFinalSubmit("⏳ Time is up! Auto-submitting your test.");
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTrialMode]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  // ✅ Webcam & Mic (only for real test)
  useEffect(() => {
    if (isTrialMode) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoElement = document.getElementById("webcam");
        if (videoElement) videoElement.srcObject = stream;

        const audioContext =
          new (window.AudioContext || window.webkitAudioContext)();
        const micSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        micSource.connect(analyser);

        const detectSound = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume =
            dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          if (volume > 20) {
            if (micViolation < 3) {
              const newCount = micViolation + 1;
              setMicViolation(newCount);
              if (newCount < 3) {
                triggerWarning(
                  `🎤 Background noise detected! Warning ${newCount}/3`
                );
              } else {
                handleFinalSubmit(
                  "❌ Test auto-submitted due to repeated mic violations."
                );
              }
            }
          }
          requestAnimationFrame(detectSound);
        };
        detectSound();
      })
      .catch((err) => console.log("Webcam/Mic denied:", err));
  }, [isTrialMode]);

  // ✅ Prevent copy/paste
  useEffect(() => {
    const disable = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disable);
    document.addEventListener("copy", disable);
    document.addEventListener("paste", disable);
    return () => {
      document.removeEventListener("contextmenu", disable);
      document.removeEventListener("copy", disable);
      document.removeEventListener("paste", disable);
    };
  }, []);

  const addViolation = (message) => {
    setViolationCount((prev) => {
      const newCount = prev + 1;
      triggerWarning(`${message}\nViolation ${newCount}/3`);
      if (newCount >= 3) {
        handleFinalSubmit("❌ Too many violations! Test auto-submitted.");
      }
      return newCount;
    });
  };

  const triggerWarning = (message) => {
    const modalMessage = document.getElementById("warningMessage");
    if (modalMessage) modalMessage.textContent = message;

    const warningModal = new window.bootstrap.Modal(
      document.getElementById("warningModal")
    );
    warningModal.show();
  };

  const handleAnswer = (qid, ans) => {
    setAnswers((prev) => ({ ...prev, [qid]: ans }));
  };

  const handleSubmitCurrent = () => {
    const currentQ = quiz[currentIndex];
    if (!answers[currentQ.id]) {
      triggerWarning("Please select an answer before submitting!");
      return;
    }

    setSubmitted((prev) => ({ ...prev, [currentQ.id]: true }));

    if (currentIndex === quiz.length - 1) {
      if (isTrialMode) {
        // ✅ Trial finished → open modal
        setShowTrialFinishModal(true);
      } else {
        handleFinalSubmit("✅ Test Completed!");
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // ✅ FIXED → Load pre-fetched real test questions
  const startRealTest = () => {
    setQuiz(realTestQuestions);
    setAnswers({});
    setSubmitted({});
    setCurrentIndex(0);
    setTimeLeft(300); // 5 min timer
    setIsTrialMode(false);
    setViolationCount(0);
    setMicViolation(0);
    setShowTrialFinishModal(false);
    enterFullscreen();
  };

  const handleFinalSubmit = (reason) => {
    let score = 0;
    quiz.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });

    console.log("✅ Final Score:", score);
     // ✅ Save score to localStorage
  const finalScoreData = {
    category: "Verbal Ability", // 👈 change this per assessment
    score: score,
    total: quiz.length,
  };

  const existingScores = JSON.parse(localStorage.getItem("testScores")) || [];
  const updatedScores = [
    ...existingScores.filter((s) => s.category !== finalScoreData.category),
    finalScoreData,
  ];
  localStorage.setItem("testScores", JSON.stringify(updatedScores));
  


    // ✅ Redirect to ResultPage with score & reason
    navigate("/result", {
      state: {
        score: score,
        total: quiz.length,
        reason: reason || "✅ Test submitted successfully!",
      },
    });
  };

  if (!quiz.length) return <h2>Loading Questions...</h2>;
  const currentQ = quiz[currentIndex];

  return (
    <div className="container-fluid d-flex">
      {/* LEFT (60%) */}
      <div className="col-8 p-4">
        <h2>
          {isTrialMode ? "Trial Question" : "Question"} {currentIndex + 1} of{" "}
          {quiz.length}
        </h2>
        <p className="fs-5">{currentQ.question}</p>

        <div className="list-group">
          {currentQ.options.map((opt, idx) => (
            <label
              key={idx}
              className={`list-group-item list-group-item-action ${
                answers[currentQ.id] === opt ? "active" : ""
              }`}
            >
              <input
                type="radio"
                className="form-check-input me-2"
                name={`q${currentQ.id}`}
                checked={answers[currentQ.id] === opt}
                onChange={() => handleAnswer(currentQ.id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>

        <button className="btn btn-primary mt-3" onClick={handleSubmitCurrent}>
          {currentIndex === quiz.length - 1 ? "Finish" : "Submit"}
        </button>
      </div>

      {/* RIGHT (40%) */}
      <div className="col-4 p-4 bg-light">
        {!isTrialMode && (
          <h4>
            ⏳ Time Left{" "}
            <span className="text-danger">{formatTime(timeLeft)}</span>
          </h4>
        )}
        <div className="d-flex flex-wrap mt-3">
          {quiz.map((q, i) => (
            <div
              key={q.id}
              className={`m-1 p-2 rounded ${
                submitted[q.id]
                  ? "bg-success text-white"
                  : "bg-secondary text-white"
              }`}
              style={{ width: "40px", textAlign: "center" }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        {!isTrialMode && (
          <div className="mt-4">
            <video id="webcam" width="100%" autoPlay muted />
          </div>
        )}
      </div>

      {/* Warning Modal */}
      <div
        className="modal fade"
        id="warningModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">⚠️ Proctoring Warning</h5>
            </div>
            <div className="modal-body" id="warningMessage">
              Suspicious activity detected!
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Completion Modal */}
      {showTrialFinishModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">🎉 Trial Completed</h5>
              </div>
              <div className="modal-body">
                Great job finishing the trial! <br /> Ready to start the real
                test?
              </div>
              <div className="modal-footer">
                <button onClick={startRealTest} className="btn btn-primary">
                  Start Real Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Score Modal (not used, just keeping if needed later) */}
      {showScoreModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">✅ Test Submitted</h5>
              </div>
              <div className="modal-body">
                Your Score: <strong>{finalScore}</strong> / {quiz.length}
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-success"
                >
                  Retake Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}