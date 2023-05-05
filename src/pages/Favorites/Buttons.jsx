import React, { useState } from "react";
import "./Buttons.css";

function Buttons({ allTutors, filterTutors, setTutors, subjects, filterName }) {
  const [search, setSearch] = useState("");
  return (
    <>
      <input
        placeholder="search for tutor name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") filterName(search);
        }}
      />
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
      </div>
      <hr />
      <button className="filters-clear" onClick={() => setTutors(allTutors)}>
        Reset Filters & Search
      </button>
    </>
  );
}

export default Buttons;
