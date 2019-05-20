import React from "react";
import { Link } from "react-router-dom";

import SEO from "../../Components/SEO";
import LandingSection from "../../Components/LandingSection";

import Github from "../../SVGImages/Github";
import LinkedIn from "../../SVGImages/Linkedin";
import AccountBadge from "../../SVGImages/AccountBadge";
import CellphoneLinkSvg from "../../SVGImages/CellphoneLinkSvg";

import "./Home.scss";

const Home = () => {
    return (
        <div className="home">
            <SEO title="Home" path="/" description="Homepage" />

            <LandingSection className="text-wrapper">
                <h1>Gregory Goijaerts</h1>
                <h2>Software Engineer</h2>

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
                    </div>
                </div>
            </LandingSection>
        </div>
    );
};

export default Home;
