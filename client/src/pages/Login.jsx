// Login.jsx
import { useState } from "react";
import axios from "axios";
import{useNavigate} from "react-router-dom";
import "./Login.css";

function Login() {

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/login",
        {
          phone,
          password
        }
      );
      console.log("LOGIN RESPONSE =",res.data);
      console.log("TOKEN SAVED =",res.data);
      localStorage.setItem("token", res.data.token);

      alert("Login Successful");
      navigate("/dashboard");

    } catch (error) {
  console.log("FULL ERROR =", error);
  console.log("RESPONSE =", error.response);
  console.log("DATA =", error.response?.data);

   alert(error.response?.data || "Login Failed");


    }

  };

  return (
    <div className="login-shell">
      <div className="login-card">

        <div className="login-brand">
          <span className="login-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3z"/>
            </svg>
          </span>
          <span className="login-brand-name">Girls Safety Alert</span>
        </div>

        <h2 className="login-heading">Login</h2>
        <p className="login-subtext">Enter your details to access your account</p>

        <div className="field-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            placeholder="Phone Number"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;