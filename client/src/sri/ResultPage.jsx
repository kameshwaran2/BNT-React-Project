import React from "react";
import { useLocation } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();

  // Data passed from AssessmentPage
  const { score = 0, total = 0, reason = "Test completed" } = location.state || {};

  const remark =
    score > Math.floor(total / 2)
      ? "🎉 Congratulations! You have passed the test."
      : "⚠️ You need improvement. Please review the topics.";

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-5 text-center" style={{ maxWidth: "500px" }}>
        <h1 className="text-success mb-3">✅ Thank You!</h1>
        <h4 className="text-secondary">{reason}</h4>

        <hr />

        <h2 className="mt-3">Your Score</h2>
        <h1 className="display-4 text-primary">{score} / {total}</h1>

        <div className="alert mt-4" style={{ fontSize: "18px", fontWeight: "bold" }}>
          {remark}
        </div>

        <p className="mt-3 text-muted">
          This is a system-generated result. No further attempts allowed.
        </p>
      </div>
    </div>
  );
}