import React from "react";
import IconButton from "@material-ui/core/IconButton";

import MenuIcon from "@material-ui/icons/Menu";

import "./LandingSection.scss";

import { DrawerContext } from "../App";

const LandingSection = ({ children, className = "", height = "100vh", displayMenuButton = true }) => {
    const { toggleOpen } = React.useContext(DrawerContext);

    return (
        <div className="landing standard-gradient" style={{ height: height }}>
            {displayMenuButton && (
                <IconButton role="presentation" aria-label="Home" className="menu-button" onClick={toggleOpen}>
                    <MenuIcon />
                </IconButton>
            )}

            <div className={`content ${className}`}>{children}</div>
        </div>
    );
};

export default LandingSection;
