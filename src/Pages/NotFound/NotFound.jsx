import React from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import "./NotFound.scss";

import LandingSection from "../../Components/LandingSection";

const NotFound = () => {
    return (
        <div className="notfound">
            <Helmet title="GregoryG - 404 page not found" />

            <LandingSection>
                <h1>Page not found!</h1>
                <NavLink to="/">Looking for the homepage?</NavLink>
            </LandingSection>
        </div>
    );
};

export default NotFound;
