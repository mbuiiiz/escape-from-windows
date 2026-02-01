import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="landing-page">
            <h1>XP Game</h1>
            <Link to="/intro">Start Game</Link>
            {/* TODO: Implement landing page */}
        </div>
    );
}

export default LandingPage;
