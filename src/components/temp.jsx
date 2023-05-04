import React, { useState } from "react";
import "../styling/Signup.css";

export default function Signup() {
  const [isTutor, setIsTutor] = useState(false);
  const [displaySignup, setDisplaySignup] = useState(false);
  const [fName, setFName] = useState();
  const [lName, setLName] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const onClick = (tutorBool) => {
    if (tutorBool) {
      setIsTutor(true);
    }

    setDisplaySignup(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    useNavigate(
      `http://127.0.0.1:3000/signup/tutor/${username}/${fName}/${lName}/${email}/${password}/I%20am%20excited%20to%20teach/Math`
    );
    // fetch(
    //   `http://127.0.0.1:3000/signup/tutor/${username}/${fName}/${lName}/${email}/${password}/I%20am%20excited%20to%20teach/Math`,
    //   { method: "POST" }
    // )
    //   .then(response.json())
    //   .then(console.log(response));
  };

  return (
    <>
      <div className="signup-box">
        <h1>Create an account</h1>
        {displaySignup === false ? (
          <form onSubmit={handleSubmit}>
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
              <form className="multi-field" id="nameField">
                <label>First Name</label>
                <br />
                <input type="text" placeholder="" value={fName} />

                <label>Last Name</label>
                <input type="text" placeholder="" value={lName} />

                <label>Email</label>
                <input type="email" placeholder="" value={email} />

                <label>Username</label>
                <input type="text" placeholder="" value={username} />

                <label>Password</label>
                <input type="password" placeholder="" value={password} />

                <label>Confirm Password</label>
                <input type="password" placeholder="" />

                <label>courses</label>
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

                <label>availability</label>
                <select name="Time" id="Time" multiple>
                  <option value="1">9 AM - 10 AM</option>
                  <option value="2">10 AM - 11 AM</option>
                  <option value="3">11 AM - 12 PM</option>
                  <option value="4">12 PM - 1 PM</option>
                  <option value="5">1 PM - 2 PM</option>
                  <option value="6">2 PM - 3 PM</option>
                  <option value="7">3 PM - 4 PM</option>
                  <option value="8">4 PM - 5 PM</option>
                  <option value="9">5 PM - 6 PM</option>
                  <option value="10">6 PM - 7 PM</option>
                </select>

                <input type="submit" value="Create account" />
              </form>
            </>
          ) : (
            <>
              <form className="multi-field" id="nameField">
                <label>First Name</label>
                <br />
                <input type="text" placeholder="" value={fName} />
                <label>Last Name</label>
                <input type="text" placeholder="" value={lName} />
                <label>Email</label>
                <input type="email" placeholder="" value={email} />
                <label>Username</label>
                <input type="text" placeholder="" value={username} />
                <label>Password</label>
                <input type="password" placeholder="" value={password} />
                <label>Confirm Password</label>
                <input type="password" placeholder="" />
                <input type="submit" value="Create account" />
              </form>
              <p>
                By clicking the button above, you agree Blu-E's <br />
                <a href="#">Terms and Condition</a>
              </p>
            </>
          )
        ) : null}
      </div>
      <div>
        <p className="para-2">
          Already have an account? <a href="login.html">Login here</a>
        </p>
        <script src="https://cdn.jsdelivr.net/gh/habibmhamadi/multi-select-tag/dist/js/multi-select-tag.js"></script>
        <script>new MultiSelectTag('course')</script>
        <script>new MultiSelectTag('Time')</script>
      </div>
    </>
  );
}
