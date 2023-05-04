import React, { useEffect, useState } from "react";
import TutorCard from "../AllTutors/TutorCard";
import Buttons from "../AllTutors/Buttons";
import "./Favorites.css";

function Favorites() {
  const [isBusy, setBusy] = useState(true);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/favorites")
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
      <h1 id="tutors-title">Meet Our Tutors</h1>

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
