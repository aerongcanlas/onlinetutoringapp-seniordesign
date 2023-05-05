import React from "react";
import { Link } from "react-router-dom";
import "./TutorCard.css";
import { useAuth0 } from "@auth0/auth0-react";

function TutorCard({ tutors }) {
  const { user } = useAuth0();
  const handleFavorite = (username) => {
    let data = {
      SID: user.nickname,
      TID: username,
    };
    console.log(JSON.stringify(data));
    fetch("http://127.0.0.1:3000/add-favorite", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json)
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
