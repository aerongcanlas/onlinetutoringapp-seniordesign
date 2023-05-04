import React from "react";
import { Link } from "react-router-dom";
import "./TutorCard.css";

function TutorCard({ tutors }) {
  return tutors.map((Val) => {
    return (
      <div id="card" key={Val.Username}>
        <div id="card-img-top">
          <img
            src={`tutors/${Val.TutorName}.png`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "tutors/alt.png";
            }}
            id="photo"
          />
        </div>
        <div id="card-body">
          <div id="tutor-name">{Val.TutorName}</div>
          <div id="tutor-subjects">{Val.Subjects}</div>
          <div id="tutor-desc">{Val.AboutMe || "--no description--"}</div>
          <Link id="appointment" to={`/set-appointment/${Val.Username}`}>
            Make an Appointment
          </Link>
        </div>
      </div>
    );
  });
}

export default TutorCard;
