import { useState } from "react";
import axios from "axios";
import{useNavigate} from "react-router-dom";

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
    <div>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Phone Number"
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

export default Login;