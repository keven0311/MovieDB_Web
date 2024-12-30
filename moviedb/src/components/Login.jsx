import { useState } from "react";
import "../styles/Login.css";
import { ToastContainer, toast} from 'react-toastify'

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const requestHeader = {
    accept: "application/json",
    'content-type':"application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjQ5YjhlZjliNGNmMzE0OGQzOGRjZmE4NDBkOGQyMCIsIm5iZiI6MTczMzI0MDgwOS41MTIsInN1YiI6IjY3NGYyN2U5ZDI3ZGNmMDA1MjNmNGE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WFQwhzh-pSTIAJWXUMZPgkTQvHkLMHVViJZwIMdSB8I",
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loginResMessage = await login(username, password);
    if(!loginResMessage?.status){
      //tostify failed to login:
      toast.error(loginResMessage.message)
    }else{
      //tostify login success
      toast.success("Login success!")
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      const loginResMessage = {
        status: true,
        message:"login success"
      }

      //request for token:
      const createTokenOptions = {
        method: "GET",
        headers: requestHeader
      };
      const tokenRes = await fetch(
        "https://api.themoviedb.org/3/authentication/token/new",
        createTokenOptions
      )
      if(!tokenRes.ok){
        loginResMessage.status = false
        loginResMessage.message = "failed to generate token"
        return loginResMessage
      }
      const { request_token } = await tokenRes.json();

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
      const loginRes = await fetch(
        "https://api.themoviedb.org/3/authentication/token/validate_with_login",
        createSessionWithLoginOptions
      )
      if(!loginRes.ok){
        // tostify login error
        if(loginRes.status === 401){
          // invalid username or password 
        loginResMessage.status = false
        loginResMessage.message = "invalid username or password"
        return loginResMessage
        }
         // failed to validate login
         loginResMessage.status = false
         loginResMessage.message = "failed to validate login"
         return loginResMessage
      }

      // creating sessioni id with request_token:
      const createSessionIdOption = {
        method: "POST",
        headers:requestHeader,
        body: JSON.stringify({
            request_token:request_token
        })
      };
      const sessionIdRes = await fetch("https://api.themoviedb.org/3/authentication/session/new",createSessionIdOption)
      if(!sessionIdRes.ok){
        // tostify session id error
        loginResMessage.status = false
        loginResMessage.message = "failed to get sessionId"
        return loginResMessage
      }
      const { session_id } = await sessionIdRes.json();

      // getting account deatils with session id:
      const accountDetailOption = {
        method:"GET",
        headers:{
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjQ5YjhlZjliNGNmMzE0OGQzOGRjZmE4NDBkOGQyMCIsIm5iZiI6MTczMzI0MDgwOS41MTIsInN1YiI6IjY3NGYyN2U5ZDI3ZGNmMDA1MjNmNGE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WFQwhzh-pSTIAJWXUMZPgkTQvHkLMHVViJZwIMdSB8I'
          }
      }
      const accountDetailsRes = await fetch(`https://api.themoviedb.org/3/account/account_id?session_id=${session_id}`,accountDetailOption)
      if(!accountDetailsRes.ok){
        // tostify account details error
        loginResMessage.status = false
        loginResMessage.message = "failed to get account details"
        return loginResMessage
      }
      const accountDetails = accountDetailsRes.json();
              
      
      // store user data into localstorage:
      const userData = {
        username,
        accountId:accountDetails.id,
        sessionId:session_id,
        requestToken:request_token
      }
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      console.log("login success")
      return loginResMessage;
    } catch (e) {
      setLoading(false);
      // tostify login error:

      throw e;
    }
  };

  if(loading){
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="login-container">
      <ToastContainer/>
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
