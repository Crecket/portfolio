import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import LandingSection from "../../Components/LandingSection";

import Github from "../../SVGImages/Github";
import LinkedIn from "../../SVGImages/Linkedin";
import CellphoneLinkSvg from "../../SVGImages/CellphoneLinkSvg";

const Home = () => {
    return (
        <div className="contact">
            <Helmet title="GregoryG - Contact" />

            <LandingSection className="text-wrapper">
                <h2>Contact</h2>

                <div className="links">
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/Crecket">
                        <Github /> Github
                    </a>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/gregory-goijaerts/">
                        <LinkedIn /> LinkedIn
                    </a>
                    <Link to="/projects">
                        <CellphoneLinkSvg /> Projects
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
