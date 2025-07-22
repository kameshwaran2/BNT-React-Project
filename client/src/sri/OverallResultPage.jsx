import React, { useEffect, useState } from "react";

const OverallResultPage = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("testScores")) || [];
    setScores(storedScores);
  }, []);

  const totalScored = scores.reduce((acc, item) => acc + item.score, 0);
  const totalQuestions = scores.reduce((acc, item) => acc + item.total, 0);
  const overallPercentage = totalQuestions
    ? ((totalScored / totalQuestions) * 100).toFixed(2)
    : 0;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📊 Overall Assessment Summary</h2>
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>Category</th>
            <th>Score</th>
            <th>Total</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={i}>
              <td>{s.category}</td>
              <td>{s.score}</td>
              <td>{s.total}</td>
              <td>{((s.score / s.total) * 100).toFixed(2)}%</td>
            </tr>
          ))}
          <tr className="table-info">
            <td><strong>Overall</strong></td>
            <td><strong>{totalScored}</strong></td>
            <td><strong>{totalQuestions}</strong></td>
            <td><strong>{overallPercentage}%</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OverallResultPage;
