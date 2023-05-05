import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Signup.css";
import bcrypt from "bcryptjs";
import { useAuth0 } from "@auth0/auth0-react";

export default function Signup() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [isTutor, setIsTutor] = useState(false);
  const [displaySignup, setDisplaySignup] = useState(false);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  const [eduLevel, setEduLevel] = useState("1st");
  const [subjects, setSubjects] = useState([]);
  const [success, setSuccess] = useState(false);

  const onClick = (tutorBool) => {
    if (tutorBool) {
      setIsTutor(true);
    }

    setDisplaySignup(true);
  };

  const handleTutorSubmit = (e) => {
    if (password == confirmPW) {
      e.preventDefault();
      const hashedPassword = bcrypt.hashSync(password, 10);
      const hash = hashedPassword.replace(/\//g, "slash");
      fetch(
        `http://127.0.0.1:3000/signup/tutor/${username}/${fName}/${lName}/${email}/${hash}/I%20am%20excited%20to%20teach/Math`,
        { method: "POST", mode: "cors" }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSuccess(true);
        })
        .catch((err) => console.log(err));

      if (success) {
        alert(`You have signed up successfully, ${fName}!`);
        navigate("/login");
      }
    } else {
      alert("Your passwords do not match!");
      e.preventDefault();
    }
  };

  const handleStudentSubmit = (e) => {
    if (password == confirmPW) {
      e.preventDefault();
      const hashedPassword = bcrypt.hashSync(password, 10);
      const hash = hashedPassword.replace(/\//g, "slash");
      fetch(
        `http://127.0.0.1:3000/signup/student/${username}/${fName}/${lName}/${email}/${hash}/${eduLevel}%20Grade`,
        { method: "POST", mode: "cors" }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSuccess(true);
        })
        .catch((err) => console.log(err));
      if (success) {
        alert(`You have signed up successfully, ${fName}!`);
        navigate("/login");
      }
    } else {
      alert("Your passwords do not match!");
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="signup-box">
        <h1 id="signup-title">Create an account</h1>
        {displaySignup === false ? (
          <form id="signup-form">
            <label> Select account type</label>
            <div className="btn-field">
              <button onClick={() => onClick(false)} id="StudentBtn">
                Student
              </button>
              <button onClick={() => onClick(true)} id="TutorBtn">
                Tutor
              </button>
            </div>
          </form>
        ) : null}

        {displaySignup ? (
          isTutor ? (
            <>
              <form
                className="multi-field"
                id="nameField"
                onSubmit={handleTutorSubmit}
              >
                <label>First Name</label>
                <br />
                <input
                  type="text"
                  placeholder=""
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                />

                <label>Last Name</label>
                <input
                  type="text"
                  placeholder=""
                  value={lName}
                  onChange={(e) => setLName(e.target.value)}
                />

                <label>Email</label>
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label>Username</label>
                <input
                  type="text"
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder=""
                  value={confirmPW}
                  onChange={(e) => setConfirmPW(e.target.value)}
                />

                <label>Courses</label>
                <select name="course" id="course" multiple>
                  <option value="1">Math</option>
                  <option value="2">Physics</option>
                  <option value="3">Chemistry</option>
                  <option value="4">Biology</option>
                  <option value="5">Computer Science</option>
                  <option value="6">Mechanical engineering</option>
                  <option value="7">Electrical engineering</option>
                  <option value="8">Government</option>
                  <option value="9">History</option>
                  <option value="10">Arts</option>
                  <option value="11">psychology</option>
                  <option value="12">Law</option>
                </select>

                <input
                  className="create-btn"
                  type="submit"
                  value="Create account"
                />
              </form>
            </>
          ) : (
            <>
              <form
                className="multi-field"
                id="nameField"
                onSubmit={handleStudentSubmit}
              >
                <label>First Name</label>
                <input
                  type="text"
                  placeholder=""
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                />

                <label>Last Name</label>
                <input
                  type="text"
                  placeholder=""
                  value={lName}
                  onChange={(e) => setLName(e.target.value)}
                />

                <label>Email</label>
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label>Username</label>
                <input
                  type="text"
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder=""
                  value={confirmPW}
                  onChange={(e) => setConfirmPW(e.target.value)}
                />

                <label>Education Level</label>
                <select
                  name="eduLevel"
                  id="eduLevel"
                  onChange={(e) => setEduLevel(e.target.value)}
                >
                  <option defaultValue="1st">1st Grade</option>
                  <option value="2nd">2nd Grade</option>
                  <option value="3rd">3rd Grade</option>
                  <option value="4th">4th Grade</option>
                  <option value="5th">5th Grade</option>
                  <option value="6th">6th Grade</option>
                  <option value="7th">7th Grade</option>
                  <option value="8th">8th Grade</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>

                <input
                  className="create-btn"
                  type="submit"
                  value="Create account"
                />
              </form>
            </>
          )
        ) : null}
      </div>
      <div>
        <p id="terms">
          By signing up, you agree to Blu-E's <br />
          <a href="#">Terms and Conditions</a>
        </p>
        <p className="para-2">
          Already have an account? <a href="login">Login here</a>
        </p>
      </div>
    </>
  );
}
