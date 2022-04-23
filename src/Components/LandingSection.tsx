import React from "react";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";

import "./LandingSection.scss";

import { DrawerContext } from "../App";

const LandingSection = ({ children, className = "", height = "100vh", displayMenuButton = true }) => {
    const { toggleOpen } = React.useContext(DrawerContext);

    return (
        <div className="landing standard-gradient" style={{ height: height }}>
            {displayMenuButton && (
                <IconButton
                    role="presentation"
                    aria-label="Menu"
                    className="menu-button"
                    onClick={toggleOpen}
                    size="large">
                    <MenuIcon />
                </IconButton>
            )}

            <div className={`content ${className}`}>{children}</div>
        </div>
    );
};

export default LandingSection;
