import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SetAppt.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SetAppt() {
  const [imgError, setImgError] = useState(true);
  const { username } = useParams();

  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const foo = {
    Monday: ["8:00-9:00", "9:00-10:00", "10:00-11:00"],
    Tuesday: ["11:00-12:00", "12:00-13:00", "13:00-14:00"],
    Wednesday: ["14:00-15:00"],
    Thursday: ["16:00-17:00"],
    Friday: ["17:00-18:00"],
    Saturday: [""],
    Sunday: [""],
  };

  const [tutor, setTutor] = useState(null);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [day, setDay] = useState(dayOfWeek[new Date().getDay()]);
  const [hours, setHours] = useState(["9:00-10:00"]);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/tutors/${username}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTutor(data);
        let avail = JSON.parse(data.Availability);
        let availHours = Object.keys(avail).filter((key) => avail[key] !== 0);
        setHours(availHours);
      })
      .catch((err) => console.log(err.message));
  }, []);

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
            <form action="#">
              <h2 id="heading">Make Appointment</h2>
              <div className="form-field">
                <p>Subject</p>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
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
                  onSelect={(e) => setDate(e)}
                  onChange={(e) => setDate(e)}
                />
                {/* <div className="custom-select">
                  <input
                    type="date"
                    onChange={(e) => {
                      setDate(new Date(e.target.value));
                      setDay(dayOfWeek[date.getDay()]);
                      setHours(foo[day]);
                      console.log(e.target.value);
                      console.log(date);
                      console.log(day);
                      console.log(hours);
                      console.log(date.getDay());
                    }}
                    value={date}
                  />
                </div> */}
              </div>
              <div className="form-field">
                <p>Time</p>
                <div className="custom-select">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    {hours.map((hour) => {
                      return <option key={hour}>{hour}</option>;
                    })}
                  </select>
                </div>
              </div>
              <button className="btn">Submit</button>
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
