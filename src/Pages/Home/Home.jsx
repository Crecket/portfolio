import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./Home.scss";

import LandingSection from "../../Components/LandingSection";

import Github from "../../SVGImages/Github";
import LinkedIn from "../../SVGImages/Linkedin";
import CellphoneLinkSvg from "../../SVGImages/CellphoneLinkSvg";

const Home = () => {
    return (
        <div className="home">
            <Helmet title="GregoryG - Home" />

            <LandingSection className="text-wrapper">
                <h1>Gregory Goijaerts</h1>
                <h2>Software Engineer</h2>

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
                    <Link to="/projects">
                        <CellphoneLinkSvg /> Other
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
