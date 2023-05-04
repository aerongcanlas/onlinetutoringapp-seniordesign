import React from "react";
import "./TutorPreview.css";

function TutorPreview() {
  return (
    <div id="tutor-preview">
      <h1 id="tutor-title">Our Tutors</h1>
      <div id="tutor-section">
        <div className="tutor">
          <img src="./tutors/tutor1.png" className="preview-img" />
          <h1 className="tutor-name">Jaya W.</h1>
          <h3 className="tutor-subjects">Biology, Chemistry</h3>
          <h4 className="tutor-quote">
            "I became a tutor because I'm determined to help other students..."
          </h4>
        </div>
        <div className="tutor">
          <img src="./tutors/tutor2.png" className="preview-img" />
          <h1 className="tutor-name">Ruben B.</h1>
          <h3 className="tutor-subjects">Physics, Mechanics</h3>
          <h4 className="tutor-quote">
            "I became a tutor because I'm determined to help other students..."
          </h4>
        </div>
        <div className="tutor">
          <img src="./tutors/tutor3.png" className="preview-img" />
          <h1 className="tutor-name">Cynthia P.</h1>
          <h3 className="tutor-subjects">Computer Science, History</h3>
          <h4 className="tutor-quote">
            "Have a question? Don't be afraid to ask! I am typically available
            on Mondays and..."
          </h4>
        </div>
        <div className="tutor">
          <img src="./tutors/tutor4.png" className="preview-img" />
          <h1 className="tutor-name">Marcus G.</h1>
          <h3 className="tutor-subjects">Calculus I & II</h3>
          <h4 className="tutor-quote">
            "Just like a calculator, you can count on me! Need help with Math?
            Book with me!"
          </h4>
        </div>
      </div>
    </div>
  );
}

export default TutorPreview;
