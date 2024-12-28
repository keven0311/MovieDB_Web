import { useState } from "react";
import "../styles/Login.css";

function Login({ BASE_URL }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log(`logging in with:${username}, ${password}`);
    console.log(BASE_URL)
  };

  return <div className="login-container">
    <form className="login-form" onSubmit={handleLoginSubmit}>
        <h2 className="login-heading">Login</h2>
        <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" type="submit">
            Login
        </button>
    </form>
  </div>;
}

export default Login;
