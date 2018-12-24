import React from "react";
import { NavLink } from "react-router-dom";

import "./LandingSection.scss";

const LandingSection = ({ children, className = "", height = "100vh", displayHomeLink = false }) => {
    return (
        <div className="landing" style={{ height: height }}>
            <div className={`content fadeIn ${className}`}>{children}</div>

            {displayHomeLink && (
                <div className="site-url">
                    <NavLink to="/">Home</NavLink>
                </div>
            )}

            <div className="stars-wrapper">
                <div className="stars-section1" />
                <div className="stars-section2" />
                <div className="stars-section3" />
            </div>
        </div>
    );
};

export default LandingSection;
