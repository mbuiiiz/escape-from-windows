import React, { useState } from "react";

const Instructions: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      setHidden(true);
      if (onComplete) onComplete();
    }, 1200);
  };

  if (hidden) return null;

  return (
    <div
      className={`instructions-fade${fadeOut ? " fade-out" : ""}`}
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        cursor: "pointer",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={handleClick}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Instructions</h1>
        <p>(Add your instructions here...)</p>
        <p style={{ fontSize: "1.2rem", marginTop: "2rem", opacity: 0.8 }}>
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
};

export default Instructions;
