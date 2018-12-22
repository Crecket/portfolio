import React from "react";

import "./LandingSection.scss";

const LandingSection = ({ children }) => {
    return (
        <div className="landing">
            {children}

            <div className="stars-wrapper">
                <div className="stars-section1" />
                <div className="stars-section2" />
                <div className="stars-section3" />
            </div>
        </div>
    );
};

export default LandingSection;
