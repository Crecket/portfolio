import React from "react";
import { Helmet } from "react-helmet";
import "./Home.scss";

import LandingSection from "../../Components/LandingSection";
import Github from "./images/Github";
import LinkedIn from "./images/Linkedin";

const Home = () => {
    return (
        <div className="home">
            <Helmet>
                <title>GregDev - Home</title>
            </Helmet>

            <LandingSection className="text-wrapper">
                <h1>Gregory Goijaerts</h1>
                <h2>Web Developer</h2>

                <div className="links">
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/Crecket">
                        <Github /> Github
                    </a>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/gregory-goijaerts/">
                        <LinkedIn /> LinkedIn
                    </a>
                    <a href="/404" rel="noopener noreferrer" style={{ display: "none" }}>
                        404
                    </a>
                </div>
            </LandingSection>
        </div>
    );
};

export default Home;
