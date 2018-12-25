import React from "react";
// import { Helmet } from "react-helmet";
import "./Projects.scss";

import LandingSection from "../../Components/LandingSection";
import useScrollPosition from "../../Hooks/useScrollPosition.js";

import ProjectItem from "./ProjectItem";

import bunqDesktopImage from "./images/bunq-desktop.png";

const Projects = () => {
    const scrollPosition = useScrollPosition();
    console.log(scrollPosition);

    return (
        <div className="projects">
            {/*<Helmet>*/}
            {/*<title>GregDev - Projects</title>*/}
            {/*</Helmet>*/}
            <LandingSection className="text-wrapper" height="40vh" displayHomeLink>
                <h1>Projects</h1>
            </LandingSection>

            <div className="project-section">
                <ProjectItem image={bunqDesktopImage} title="bunqDesktop" description="testDescription" />
            </div>
        </div>
    );
};

export default Projects;
