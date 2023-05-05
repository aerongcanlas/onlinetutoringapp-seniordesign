import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SetAppt.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SetAppt() {
  const [imgError, setImgError] = useState(true);
  const { username } = useParams();

  const [tutor, setTutor] = useState(null);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState(new Date().toString());
  const [time, setTime] = useState("");
  const [hours, setHours] = useState([""]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/tutors/${username}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTutor(data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const handleDateChange = (e) => {
    setDate(e);
    const tempDateString =
      e.getFullYear().toString() +
      "-" +
      (e.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      e.getDate().toString().padStart(2, "0");

    setDateString(tempDateString);
    fetch(`http://127.0.0.1:3000/availability/${username}/${tempDateString}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setHours(data.map((a) => a.startTime.padStart(8, "0").slice(0, 5)));
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const SID = "AbigailAlexander25";
    let data = {
      SID,
      TID: username,
      date: dateString,
      time,
      subject,
    };
    console.log(JSON.stringify(data));
    fetch("http://127.0.0.1:3000/set-appointment", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json)
      .then((data) => setSuccess(true))
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      {tutor ? (
        <div id="container">
          <div id="tutor-info">
            <img
              src={`${import.meta.env.BASE_URL}tutors/${tutor.TutorName}.png`}
              onError={(e) => {
                if (imgError) {
                  setImgError(false);
                  console.log(
                    `${import.meta.env.BASE_URL}/tutors/${tutor.TutorName}.png`
                  );
                  e.target.src = `${import.meta.env.BASE_URL}tutors/alt.png`;
                }
              }}
              id="tutor-pic"
            />
            <h1 id="tutor-name">{tutor.TutorName}</h1>
            <p id="about-me">{tutor.AboutMe || "--no description--"}</p>
            <hr />
          </div>

          <div id="container-form">
            <form onSubmit={handleSubmit}>
              <h2 id="heading">Make Appointment</h2>
              <div className="form-field">
                <p>Subject</p>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option key={""}></option>
                  {tutor.Subjects.split().map((subj) => {
                    return <option key={subj}>{subj}</option>;
                  })}
                </select>
              </div>
              <div className="form-field">
                <p>Date</p>
                <DatePicker
                  id="date"
                  selected={date}
                  onSelect={(e) => handleDateChange(e)}
                  onChange={(e) => handleDateChange(e)}
                />
              </div>
              <div className="form-field">
                <p>Time</p>
                <div className="custom-select">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option key={""}></option>
                    {hours.map((hour) => {
                      return <option key={hour}>{hour}</option>;
                    })}
                  </select>
                </div>
              </div>
              <button className="btn">Submit</button>
              {success && <div>Thank you for setting an appointment!</div>}
            </form>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default SetAppt;
