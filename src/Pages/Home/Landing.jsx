import React from "react";

import LinkedIn from "./images/Linkedin";
import Github from "./images/Github";
import "./Landing.scss";

const Landing = () => {
    return (
        <div className="landing">
            <div className="text-wrapper">
                <h1>Gregory Goijaerts</h1>
                <h2>Web Developer</h2>

                <div className="links">
                    <a href="https://github.com/Crecket">
                        <Github /> Github
                    </a>
                    <a href="https://www.linkedin.com/in/gregory-goijaerts/">
                        <LinkedIn /> LinkedIn
                    </a>
                </div>
            </div>

            <div className="stars-wrapper">
                <div className="stars-section1" />
                <div className="stars-section2" />
                <div className="stars-section3" />
            </div>
        </div>
    );
};

export default Landing;
