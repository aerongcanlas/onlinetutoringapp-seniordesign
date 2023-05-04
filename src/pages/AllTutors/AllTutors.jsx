import React, { useEffect, useState } from "react";
import TutorCard from "./TutorCard";
import Buttons from "./Buttons";
import "./AllTutors.css";

function AllTutors() {
  const [isBusy, setBusy] = useState(true);
  const [allTutors, setAllTutors] = useState([]);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/tutors")
      .then((response) => {
        setBusy(false);
        return response.json();
      })
      .then((data) => {
        setTutors(data);
        setAllTutors(data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const subjects = [
    ...new Set(allTutors.map((Val) => Val.Subjects).flat()),
  ].sort();

  const filterTutors = (currSubject) => {
    const newTutor = tutors.filter((newVal) => {
      return newVal.Subjects.includes(currSubject);
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
            allTutors={allTutors}
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

export default AllTutors;
