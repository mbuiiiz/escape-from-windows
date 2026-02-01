

import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./ending1.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Ending1: React.FC = () => {
  const [fadeIn, setFadeIn] = useState(false);


  // Fade in effect
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50);
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={250} recycle={false} />
      <div className={`ending1-container container text-center${fadeIn ? " fade-in" : ""}`}>
        <h1 className="display-4">Congratulations!</h1>
        <p className="lead">You have solved the puzzle and reached the end of the game.<br />
        The door finally unlocks behind you and you escape the room successfully!</p>
        <a href="/" className="btn btn-primary mt-3">Back to Landing</a>
      </div>
    </div>
  );
};

export default Ending1;
