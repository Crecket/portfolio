import React from "react";
import { Link } from "react-router-dom";

import SEO from "../../Components/SEO";
import LandingSection from "../../Components/LandingSection";

import Github from "../../SVGImages/Github";
import LinkedIn from "../../SVGImages/Linkedin";
import AccountBadge from "../../SVGImages/AccountBadge";
import CellphoneLinkSvg from "../../SVGImages/CellphoneLinkSvg";

import "./Eve.scss";

const Eve = () => {
    return (
        <div className="home">
            <SEO title="Eve - Hypernet" path="/" description="Eve hypernet calculator" />

            <LandingSection className="text-wrapper">
                <h1>Eve</h1>
                <h2>HyperNet</h2>

                <div className="links">
                    <a className="animated" target="_blank" rel="noopener noreferrer" href="https://github.com/Crecket">
                        <Github /> Github
                    </a>
                    <a
                        className="animated"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.linkedin.com/in/gregory-goijaerts/"
                    >
                        <LinkedIn /> LinkedIn
                    </a>
                    <Link className="animated" to="/projects">
                        <CellphoneLinkSvg /> Projects
                    </Link>
                    <Link className="animated" to="/contact">
                        <AccountBadge /> Contact
                    </Link>

                    <div style={{ display: "none" }}>
                        <a href="/notfound" rel="noopener noreferrer">
                            notfound
                        </a>
                        <a href="/bunq" rel="noopener noreferrer">
                            bunq
                        </a>
                        <a href="/bunq-images" rel="noopener noreferrer">
                            bunq-images
                        </a>
                    </div>
                </div>
            </LandingSection>
        </div>
    );
};

export default Eve;
