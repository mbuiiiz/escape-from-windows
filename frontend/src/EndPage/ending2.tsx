import React, { useEffect, useState } from "react";
import "./ending2.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Ending2: React.FC = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50);
    document.body.classList.add('ending2-bg');
    return () => {
      document.body.classList.remove('ending2-bg');
    };
  }, []);

  return (
    <div className={`ending2-container text-center${fadeIn ? " fade-in" : ""}`}>
      <h1 className="display-4">Fail.</h1>
      <p className="lead">You failed to solve the puzzle in time.<br />
      The doors are locked forever and you are trapped here.</p>
      <a href="/" className="btn btn-primary mt-3">Back to Landing</a>
    </div>
  );
};

export default Ending2;
