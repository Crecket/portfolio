import React from "react";
import { Helmet } from "react-helmet";
import "./Projects.scss";

import LandingSection from "../../Components/LandingSection";

const Projects = () => {
    return (
        <div className="projects">
            <Helmet>
                <title>GregDev - Projects</title>
            </Helmet>

            <LandingSection className="text-wrapper" height="40vh" displayHomeLink>
                <h1>Projects!</h1>
            </LandingSection>

            <div className="project-section">
                <div className="project-item">
                    <h3>Project 1</h3>
                    <p>Description for this random project which is slightly longer</p>
                </div>
            </div>
        </div>
    );
};

export default Projects;
