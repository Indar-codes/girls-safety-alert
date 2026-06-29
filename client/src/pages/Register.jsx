// Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {

    try {

      const res = await axios.post(
        "https://girls-safety-alert.onrender.com/register",
        {
          name,
          phone,
          password
        }
      );
      console.log("REGISTER RESPONSE =", res.data);

      alert("Registration Successful");
      navigate("/login");

    } catch (error) {
      console.log("FULL ERROR =", error);
      console.log("RESPONSE =", error.response);
      console.log("DATA =", error.response?.data);

      alert(error.response?.data || "Registration Failed");
    }

  };

  return (
    <div className="register-shell">
      <div className="register-card">

        <div className="register-brand">
          <span className="register-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3z"/>
            </svg>
          </span>
          <span className="register-brand-name">Girls Safety Alert</span>
        </div>

        <h2 className="register-heading">Register</h2>
        <p className="register-subtext">Create an account to get started</p>

        <div className="field-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="register-button" onClick={handleRegister}>
          Register
        </button>

      </div>
    </div>
  );
}

export default Register;