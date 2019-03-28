import React from "react";
import { NavLink } from "react-router-dom";
import ParticleField from "react-particles-webgl";

import "./LandingSection.scss";
import ReactParticleConfig from "../Config/ReactParticleConfig";

const LandingSection = ({ children, className = "", height = "100vh", displayHomeLink = false }) => {
    return (
        <div className="landing" style={{ height: height }}>
            <div className={`content fadeIn ${className}`}>{children}</div>

            {displayHomeLink && (
                <div className="site-url">
                    <NavLink to="/">Home</NavLink>
                </div>
            )}

            <div className={"particle-wrapper fadeInSlow"}>
                {navigator.userAgent === "ReactSnap" ? null : <ParticleField config={ReactParticleConfig} />}
            </div>
        </div>
    );
};

export default LandingSection;
