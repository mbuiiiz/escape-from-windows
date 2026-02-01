/*import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";
import Instructions from "./Instructions";
import VideoPlayerTransition from "./VideoPlayerTransition";
import explorer from "../assets/explorer.png";
import close from "../assets/close.png";
import VideoPlayerDesktopIcon from "./VideoPlayerDesktopIcon";


const HomePage: React.FC = () => {
  const [step, setStep] = useState<'home' | 'video' | 'instructions'>('home');
  const [shrinkWindow, setShrinkWindow] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number; show: boolean; click: boolean; step?: 'x' | 'icon' | 'expand' } | null>(null);
  const [videoExpanded, setVideoExpanded] = useState(false);

  const handleStart = (e: React.MouseEvent) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    setCursor({ x: clickX, y: clickY, show: true, click: false, step: 'x' });
    setTimeout(() => {
      // Move cursor to X button
      const xBtn = document.querySelector(".win-control");
      if (xBtn) {
        const xRect = xBtn.getBoundingClientRect();
        setCursor({ x: xRect.left + xRect.width / 2, y: xRect.top + xRect.height / 2, show: true, click: false, step: 'x' });
        setTimeout(() => {
          setCursor({ x: xRect.left + xRect.width / 2, y: xRect.top + xRect.height / 2, show: true, click: true, step: 'x' });
          setTimeout(() => {
            // Keep mouse at X button position after closing
            setCursor({ x: xRect.left + xRect.width / 2, y: xRect.top + xRect.height / 2, show: true, click: false, step: 'icon' });
            setShrinkWindow(true);
            setTimeout(() => {
              // Move cursor to Video Player icon
              const icon = document.querySelector(".video-player-desktop-icon");
              if (icon) {
                const iconRect = icon.getBoundingClientRect();
                setCursor({ x: iconRect.left + iconRect.width / 2, y: iconRect.top + iconRect.height / 2, show: true, click: false, step: 'icon' });
                setTimeout(() => {
                  setCursor({ x: iconRect.left + iconRect.width / 2, y: iconRect.top + iconRect.height / 2, show: true, click: true, step: 'icon' });
                  setTimeout(() => {
                    // Move cursor to expand icon in video player
                    setStep('video');
                    setTimeout(() => {
                      const expandIcon = document.querySelector('.expand-icon');
                      if (expandIcon) {
                        const expandRect = expandIcon.getBoundingClientRect();
                        setCursor({ x: expandRect.left + expandRect.width / 2, y: expandRect.top + expandRect.height / 2, show: true, click: false, step: 'expand' });
                        setTimeout(() => {
                          setCursor({ x: expandRect.left + expandRect.width / 2, y: expandRect.top + expandRect.height / 2, show: true, click: true, step: 'expand' });
                          setTimeout(() => {
                            setVideoExpanded(true);
                          }, 350);
                        }, 1200);
                      }
                    }, 600);
                  }, 300);
                }, 1200);
              }
            }, 1200);
          }, 300);
        }, 1400); // slower travel
      }
    }, 400);
  };

  const handleVideoComplete = () => {
    setCursor(null); // Hide cursor when instructions page is shown
    setStep('instructions');
  };

  // Hide cursor only when instructions page is shown
  useEffect(() => {
    if (step === 'instructions') {
      setCursor(null);
    }
  }, [step]);

  if (step === 'instructions') {
    return <Instructions />;
  }

  if (step === 'video') {
    return (
      <>
        <div className="video-player-bg" />
        <VideoPlayerDesktopIcon />
        <VideoPlayerTransition
          onComplete={handleVideoComplete}
          onExpandClick={() => setVideoExpanded(true)}
          expanded={videoExpanded}
        />
        {cursor && cursor.show && (
          <div
            className={`fake-cursor${cursor.click ? " click" : ""}`}
            style={{ left: cursor.x - 12, top: cursor.y - 12 }}
          />
        )}
      </>
    );
  }

  return (
    <div className="homepage">
      <VideoPlayerDesktopIcon />
      <div className={`ie-window${shrinkWindow ? " shrink" : ""}`}>
        <div className="ie-titlebar">
          <img src={explorer} alt="Explorer Icon" className="ie-icon" />
          <span className="ie-title">Internet Explorer</span>
          <img src={close} alt="Close Window" className="win-control" />
        </div>

        <div className="ie-content">
          <div className="logo">
            Escape From Windows
          </div>

          <button className="btn btn-primary ie-button" onClick={handleStart}>
            Start
          </button>

          <button className="btn btn-secondary ie-button">
            Continue
          </button>
        </div>
      </div>
      {cursor && cursor.show && (
        <div
          className={`fake-cursor${cursor.click ? " click" : ""}`}
          style={{ left: cursor.x - 12, top: cursor.y - 12 }}
        />
      )}
    </div>
  );
};

export default HomePage;
*/
