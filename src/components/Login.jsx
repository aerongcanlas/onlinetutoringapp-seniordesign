import React, { useState, useEffect } from "react";
import "../styling/Login.css";
import { Navigate } from "react-router-dom";
import bcrypt from "bcryptjs";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loggedIn);
    fetch(`http://127.0.0.1:3000/login/${username}/${password}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        bcrypt.compare(
          password,
          data.Password.replace(/slash/g, "/"),
          (err, isMatch) => {
            if (err) throw err;
            else if (!isMatch) console.log("Pw doesnt match");
            else {
              console.log("Pw matches");
              setLoggedIn(true);
            }
          }
        );
      })
      .catch((err) => console.log(err));
    if (loggedIn) {
      alert("You have successfully logged in!");
      e.preventDefault();
      <Navigate to="/" replace={true} />;
    }
  };

  useEffect(() => {
    localStorage.setItem("current-user", username);
  }, [loggedIn]);

  return (
    <>
      <div className="content">
        <h1>Log In</h1>
        <img
          src="./undraw_remotely_2j6y.svg"
          alt="Image"
          className="img-fluid"
        />

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* <div className="remember-me">
            <label className="control">Remember Me</label>
            <input type="checkbox" checked="checked" />
          </div> */}

          <label />
          <input type="submit" value="Log In" className="login" />
        </form>
        <span className="ml-auto">
          <a href="#" className="forgot-pass">
            Forgot Password
          </a>
        </span>
      </div>
    </>
  );
}

export default Login;
