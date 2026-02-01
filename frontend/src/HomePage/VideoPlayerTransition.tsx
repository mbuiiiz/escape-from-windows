import React, { useEffect, useState } from "react";
import "./HomePage.css";

const VideoPlayerTransition: React.FC<{ onComplete: () => void, onExpandClick?: () => void, expanded?: boolean }> = ({ onComplete, onExpandClick, expanded }) => {
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (expanded) {
      setTimeout(() => setExpand(true), 400); // Delay for effect
      setTimeout(() => onComplete(), 1800); // Duration of expand
    }
  }, [onComplete, expanded]);

  return (
    <div className={`video-player-window${expand ? " expand" : ""}`}>
      <div className="video-player-titlebar">
        Video Player
        <span
          className="expand-icon"
          style={{ position: "absolute", right: 12, top: -2, cursor: "pointer", fontSize: 22 }}
          onClick={onExpandClick}
          role="img"
          aria-label="expand"
        >
          ⬜
        </span>
      </div>
      <div className="video-player-content">
        <span role="img" aria-label="video">🎬</span>
      </div>
    </div>
  );
};

export default VideoPlayerTransition;
