import React from "react";
import Link from "react-router-dom/Link";
import IconButton from "@material-ui/core/IconButton";

import HomeIcon from "@material-ui/icons/Home";

import "./LandingSection.scss";

const LandingSection = ({ children, className = "", height = "100vh", displayMenuButton = false }) => {
    return (
        <div className="landing standard-gradient" style={{ height: height }}>
            {displayMenuButton && (
                <IconButton role="presentation" aria-label="Home" className="menu-button" component={Link} to="/">
                    <HomeIcon />
                </IconButton>
            )}

            <div className={`content ${className}`}>{children}</div>
        </div>
    );
};

export default LandingSection;
