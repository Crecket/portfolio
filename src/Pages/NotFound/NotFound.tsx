import React from "react";
import { Link } from "react-router-dom";

import SEO from "../../Components/SEO";
import LandingSection from "../../Components/LandingSection";

import "./NotFound.scss";

const NotFound = () => {
    return (
        <div className="notfound">
            <SEO title="404 not found" description="Page not found" path="/404" />

            <LandingSection>
                <h1>Page not found!</h1>

                <Link className="" to="/">
                    Looking for the homepage?
                </Link>
            </LandingSection>
        </div>
    );
};

export default NotFound;
