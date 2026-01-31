import React from "react";
import { Link } from "react-router-dom";
import { introText } from "../story/introText";

function IntroPage() {
    return (
        <div className="intro-page">
            <div className="intro-content">{introText.opening}</div>
            <Link to="/game">Continue to Game</Link>
            {/* TODO: Implement intro sequence */}
        </div>
    );
}

export default IntroPage;
