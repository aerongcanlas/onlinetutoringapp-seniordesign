import React, { useState } from "react";
import "./Buttons.css";

function Buttons({ allTutors, filterTutors, setTutors, subjects }) {
  return (
    <>
      <p id="filters-title">Filters</p>
      <div id="filters-container">
        {subjects.map((Val, id) => {
          return (
            <button
              className="filters-button"
              onClick={() => filterTutors(Val)}
              key={id}
            >
              {Val}
            </button>
          );
        })}
        <button className="filters-clear" onClick={() => setTutors(allTutors)}>
          Reset Filters
        </button>
      </div>
    </>
  );
}

export default Buttons;
