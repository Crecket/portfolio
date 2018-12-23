import React from "react";

import "./LandingSection.scss";

const LandingSection = ({ children, className = "" }) => {
    return (
        <div className="landing">
            <div className={`content fadeIn ${className}`}>
                {children}
            </div>

            <div className="stars-wrapper">
                <div className="stars-section1" />
                <div className="stars-section2" />
                <div className="stars-section3" />
            </div>
        </div>
    );
};

export default LandingSection;
