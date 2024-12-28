import { useState } from "react";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const requestHeader = {
    accept: "application/json",
    'content-type':"application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjQ5YjhlZjliNGNmMzE0OGQzOGRjZmE4NDBkOGQyMCIsIm5iZiI6MTczMzI0MDgwOS41MTIsInN1YiI6IjY3NGYyN2U5ZDI3ZGNmMDA1MjNmNGE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WFQwhzh-pSTIAJWXUMZPgkTQvHkLMHVViJZwIMdSB8I",
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log(`logging in with:${username}, ${password}`);
    await login(username, password);
  };

  const login = async (username, password) => {
    try {
      setLoading(true);

      //request for token:
      const createTokenOptions = {
        method: "GET",
        headers: requestHeader
      };
      const { request_token } = await fetch(
        "https://api.themoviedb.org/3/authentication/token/new",
        createTokenOptions
      ).then((res) => res.json());

      // creating session with username and password:
      const createSessionWithLoginOptions = {
        method: "POST",
        headers: requestHeader,
        body: JSON.stringify({
          username: username,
          password: password,
          request_token: request_token,
        }),
      };
      await fetch(
        "https://api.themoviedb.org/3/authentication/token/validate_with_login",
        createSessionWithLoginOptions
      )

      // creating sessioni id with request_token:
      const createSessionIdOption = {
        method: "POST",
        headers:requestHeader,
        body: JSON.stringify({
            request_token:request_token
        })
      };
      const {session_id} = await fetch("https://api.themoviedb.org/3/authentication/session/new",createSessionIdOption)
            .then((res) => res.json())

      // getting account deatils with session id:
      const accountDetailOption = {
        method:"GET",
        headers:{
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjQ5YjhlZjliNGNmMzE0OGQzOGRjZmE4NDBkOGQyMCIsIm5iZiI6MTczMzI0MDgwOS41MTIsInN1YiI6IjY3NGYyN2U5ZDI3ZGNmMDA1MjNmNGE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WFQwhzh-pSTIAJWXUMZPgkTQvHkLMHVViJZwIMdSB8I'
          }
      }
      const accountDetails = await fetch(`https://api.themoviedb.org/3/account/account_id?session_id=${session_id}`,accountDetailOption)
                            .then((res) => res.json())
      
      const userData = {
        username,
        accountId:accountDetails.id,
        sessionId:session_id,
        requestToken:request_token
      }
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  return (
    <div className="login-container">
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
    </div>
  );
}

export default Login;
