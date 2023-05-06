import React, { useEffect, useState } from "react";
import TutorCard from "./TutorCard";
import Buttons from "./Buttons";
import "./Favorites.css";
import { useAuth0 } from "@auth0/auth0-react";

function Favorites() {
  const { user } = useAuth0();
  const [isBusy, setBusy] = useState(true);
  const [allTutors, setAllTutors] = useState([]);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const data = {
      SID: user.nickname,
    };
    fetch("http://127.0.0.1:3000/favorites", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        setBusy(false);
        return response.json();
      })
      .then((r) => {
        console.log(r);
        setTutors(r);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const subjects = [
    ...new Set(tutors.map((Val) => Val.Subjects).flat()),
  ].sort();

  const filterTutors = (currSubject) => {
    const newTutor = tutors.filter((newVal) => {
      return newVal.subjects.includes(currSubject);
      // comparing category for displaying data
    });
    setTutors(newTutor);
  };

  return (
    <div id="tutors-page">
      <h1 id="tutors-title">Your Favorites</h1>

      <div id="tutors-main">
        <div id="filters-column">
          <Buttons
            setTutors={setTutors}
            subjects={subjects}
            filterTutors={filterTutors}
          />
        </div>
        <div id="tutors-column">
          <TutorCard tutors={tutors} />
        </div>
      </div>
    </div>
  );
}

export default Favorites;
