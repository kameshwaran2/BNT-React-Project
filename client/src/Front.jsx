import { useState } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { login } from "./actions/auth";
import { useNavigate } from "react-router-dom";

function Front() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(" ");

  const dispatch = useDispatch(); //distribute to the component via redux reducers
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      dispatch(login({ name, email }));
    }
    setIsSubmitted(true);
    navigate("/hi");
  };

  return (
    <div className="app-background">
      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="card">
          <h2>Welcome</h2>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
export default Front;
