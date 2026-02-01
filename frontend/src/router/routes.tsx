import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import IntroPage from "../pages/IntroPage";
import GamePage from "../pages/GamePage";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/game" element={<GamePage />} />
        </Routes>
    );
}
