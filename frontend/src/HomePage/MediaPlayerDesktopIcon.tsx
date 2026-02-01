import React from "react";
import videoPlayerIcon from "./assets/video-player-icon.png"; // Ensure this matches the video player window icon

const VideoPlayerDesktopIcon: React.FC = () => (
  <div className="video-player-desktop-icon">
    <img src={videoPlayerIcon} alt="Video Player Icon" className="desktop-icon-img" />
    <span className="desktop-icon-label">Video Player</span>
  </div>
);

export default VideoPlayerDesktopIcon;
