import React, { useState } from "react";

function Image({ name }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return <img src="../img/alt.png" onError={() => setImgError(true)} />;
  }
  return <img src={`../img/tutors/${name}.png`} />; // with no onError
}

export default Image;
